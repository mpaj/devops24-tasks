FROM python:3

RUN pip install --no-cache-dir flask
COPY ./server.py .

EXPOSE 5000
CMD ["python3", "server.py"]