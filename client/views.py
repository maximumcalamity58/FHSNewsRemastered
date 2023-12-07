from django.shortcuts import render
from django.http import JsonResponse
import os
import json
from datetime import datetime

def home(request):
    return render(request, 'index.html')

def info(request):
    return render(request, 'info.html')

def clubs(request):
    return render(request, 'clubs.html')

def calendar(request):
    return render(request, 'calendar.html')

def editable_calendar(request):
    return render(request, 'editable_calendar.html')

async def add_event(request):
    if request.method == 'POST':
        try:
            eventData = json.loads(request.body)

            # Extract year and month from the event date
            eventDate = datetime.fromisoformat(eventData['date'])
            del eventData['date']

            year = eventDate.year
            month = str(eventDate.month).zfill(2)  # Months are 1-indexed in Python

            filename = f"{year}-{month}.json"
            filePath = os.path.join('client/static/data/userdata', filename)

            # Check if the file exists and read or initialize it
            try:
                if os.path.exists(filePath):
                    with open(filePath, 'r') as file:
                        calendarData = json.load(file)
                else:
                    calendarData = {}

                dayIndex = str(eventDate.day)

                if dayIndex not in calendarData:
                    calendarData[dayIndex] = []

                calendarData[dayIndex].append(eventData)

                # Write the updated data back to the file
                with open(filePath, 'w') as file:
                    json.dump(calendarData, file, indent=2)

                return JsonResponse({'message': 'Event added successfully'}, status=200)

            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
