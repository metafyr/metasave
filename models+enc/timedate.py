from datetime import datetime

current_time = datetime.now()

formatted_date = current_time.strftime("%Y-%m-%d")
print("Formatted current date:", formatted_date)

formatted_time = current_time.strftime("%H:%M:%S")
print("Formatted current time:", formatted_time)