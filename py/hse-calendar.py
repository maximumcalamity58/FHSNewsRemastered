import scrapy
import json
import os
import re
from scrapy.signals import spider_closed
from datetime import datetime


class HseCalendarSpider(scrapy.Spider):
    name = "hsecalendar"
    school_name = None
    school_id = 0  # Initialize with 0 so we can start with ID 1

    base_url = "https://www.hsecalendars.org/public/genie/752/school/{}/view/month/"

    def start_requests(self):
        self.school_id += 1
        yield scrapy.Request(self.base_url.format(self.school_id), errback=self.handle_error)

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(HseCalendarSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=spider_closed)
        return spider

    def parse(self, response):
        # Extract school name from the provided structure
        self.school_name = response.css('.main-header .school h1::text').get().lower().replace(' ', '-')

        events_data = []

        for day_li in response.css('ul:not(.weekdays) li.day:not(.other-month)'):
            date = day_li.css('.date::text').get()

            for event_div in day_li.css('.event'):
                title = event_div.css('.event-desc a::text').get()
                time = event_div.css('.event-time::text').get()
                location_anchor = event_div.css('.event-desc-sub a::attr(href)').get()
                if location_anchor and "javascript:alert" in location_anchor:
                    location = re.search(r"alert\('([^']+)'\)", location_anchor)
                    if location:
                        location = location.group(1)
                    else:
                        location = event_div.css('.event-desc-sub::text').get()
                else:
                    location = event_div.css('.event-desc-sub::text').get()

                events_data.append({
                    "date": date.strip() if date else None,
                    "title": title.strip() if title else None,
                    "time": time.strip() if time else None,
                    "location": location.strip() if location else None
                })

        # Format the data for this URL and save it to a specific file
        self.save_data(events_data)

        # Increment the school ID and scrape the next school
        self.school_id += 1
        yield scrapy.Request(self.base_url.format(self.school_id), errback=self.handle_error)

    def save_data(self, data):
        # Ensure base directory exists
        base_dir = 'calendar-data'
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)

        # Create school-specific directory
        school_dir = os.path.join(base_dir, f'{self.school_id}-{self.school_name}')
        if not os.path.exists(school_dir):
            os.makedirs(school_dir)

        formatted_data = {}
        for item in data:
            date = item['date']
            event_data = {
                "title": item["title"],
                "time": item["time"],
                "location": item["location"]
            }
            if date not in formatted_data:
                formatted_data[date] = []
            formatted_data[date].append(event_data)

        # Extract the current year and month
        year, month = datetime.now().strftime('%Y-%m').split('-')

        # Modify file path to include school-specific directory and year-month
        filename = os.path.join(school_dir, f'{year}-{month}.json')
        with open(filename, 'w') as f:
            json.dump(formatted_data, f, indent=4)

    def spider_closed(self, spider):
        # Clear the hse-calendar.json
        with open('hse-calendar.json', 'w') as f:
            f.write('')

    def handle_error(self, failure):
        # This function is called when an error occurs.
        # You can log the error or perform other actions as needed.
        self.logger.error(f"Error occurred for school ID {self.school_id}. Stopping spider.")