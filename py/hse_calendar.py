import scrapy
import json
import os
import re
from scrapy.signals import spider_closed
from datetime import datetime, timedelta, date


class HseCalendarSpider(scrapy.Spider):
    name = "hsecalendar"
    school_name = None
    school_id = 0  # Initialize with 0 so we can start with ID 1
    months_scraped = 0  # Track the number of months scraped for the current school
    last_day_encountered = False

    base_url = "https://www.hsecalendars.org/public/genie/752/school/{}/date/{}/view/month/"

    def start_requests(self):
        self.school_id += 1
        # Start from today's year and month
        start_date = datetime.now().strftime('%Y-%m-01')
        yield scrapy.Request(self.base_url.format(self.school_id, start_date), errback=self.handle_error)

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(HseCalendarSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=spider_closed)
        return spider

    def get_last_month_day_color(self, year, month):
        if not year or not month:
            self.logger.error(
                f"Invalid year ({year}) or month ({month}). Unable to determine the color of the last day.")
            return None

        """Get the color of the last school day of the previous month."""

        # Get the first day of the current month
        first_day_current_month = date(int(year), int(month), 1)

        # Subtract one day to get the last day of the previous month
        last_day_of_prev_month = first_day_current_month - timedelta(days=1)

        # Update year and month based on the last day of the previous month
        year = str(last_day_of_prev_month.year)
        month = str(last_day_of_prev_month.month).zfill(2)

        # Read the previous month's data
        school_dir = os.path.join('calendar-data', f'{self.school_id}-{self.school_name}')
        filename = os.path.join(school_dir, f'{year}-{month}.json')
        if not os.path.exists(filename):
            return None

        with open(filename, 'r') as f:
            data = json.load(f)

        # Check for last school day color
        for i in range(14):  # A week's range just to be sure
            formatted_date = last_day_of_prev_month.strftime('%d')
            if formatted_date in data:
                for event in data[formatted_date]:
                    if event["title"].lower() in ["red day", "silver day"]:
                        return event["title"].lower()
            last_day_of_prev_month -= timedelta(days=1)

        return None

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
        self.save_data(events_data, response.url)

        # Increment the month
        self.months_scraped += 1
        if self.months_scraped < 12:
            # Parse the year and month from the current URL and create the next month's URL
            match = re.search(r'date/(\d{4}-\d{2})-01', response.url)
            if match:
                current_year, current_month = map(int, match.group(1).split('-'))
                next_month_date = (datetime(current_year, current_month, 1) + timedelta(days=31)).strftime(
                    '%Y-%m-01')
                yield scrapy.Request(self.base_url.format(self.school_id, next_month_date),
                                     errback=self.handle_error)
            else:
                # Reset the months_scraped count and move to the next school
                self.months_scraped = 0
                self.last_day_encountered = False  # Resetting last_day_encountered for the next school
                self.school_id += 1
                start_date = datetime.now().strftime('%Y-%m-01')
                yield scrapy.Request(self.base_url.format(self.school_id, start_date), errback=self.handle_error)

    def save_data(self, data, url):
        year, month = None, None
        match = re.search(r'date/(\d{4}-\d{2})-01', url)
        if match:
            year, month = match.group(1).split('-')
        else:
            self.logger.error(f"Failed to extract year and month from URL: {url}")
            return

        # Ensure base directory exists
        base_dir = 'calendar-data'
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)

        # Create school-specific directory
        school_dir = os.path.join(base_dir, f'{self.school_id}-{self.school_name}')
        if not os.path.exists(school_dir):
            os.makedirs(school_dir)

        # Format the data
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

            # Extract the year and month from the URL
            match = re.search(r'date/(\d{4}-\d{2})-01', url)
            if match:
                year, month = match.group(1).split('-')
            else:
                return

        # Get the last school day color of the previous month
        prev_month_last_day_color = self.get_last_month_day_color(year, month)
        if prev_month_last_day_color == "red day":
            current_day_color = "silver day"
        elif prev_month_last_day_color == "silver day":
            current_day_color = "red day"
        else:
            current_day_color = None

        # Keywords and phrases to skip
        skip_keywords = [
            "no school", "teacher day", "elearning", "testing day",
            "flex day", "psat", "semester exams", "winter break"
        ]

        for day, events in sorted(formatted_data.items(), key=lambda x: int(x[0])):
            try:
                day_date = datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
            except ValueError:
                print(f"Error parsing date: {year}-{month}-{day}")
                continue

            # Skip weekends
            if day_date.weekday() >= 5:
                continue

            # Skip days based on keywords
            if any(any(keyword in event["title"].lower() for keyword in skip_keywords) for event in events):
                continue

            # Start the color rotation on the "first day of school" (this will override any previous setting)
            if any(event["title"].lower() == "first day of school" for event in events):
                current_day_color = "red day"
                self.last_day_encountered = False

            # Check if "last day of school" event is encountered
            if any(event["title"].lower() == "last day of school" for event in events):
                self.last_day_encountered = True
                current_day_color = None

            # If the current color is set (either from the last day of the previous month or "first day of school")
            if current_day_color and not self.last_day_encountered:
                # Insert the color day event at the top
                events.insert(0, {
                    "title": current_day_color.capitalize(),
                    "time": None,
                    "location": None
                })

                # Alternate colors for subsequent days
                if current_day_color == "red day":
                    current_day_color = "silver day"
                else:
                    current_day_color = "red day"

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