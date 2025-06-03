FROM python:3.11

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir pika
RUN chmod +x start_worker.sh

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000
