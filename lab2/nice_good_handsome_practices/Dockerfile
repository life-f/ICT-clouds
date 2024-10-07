FROM python:3.9.6

RUN apt-get update && pip3 install pyyaml

COPY . .

WORKDIR /

CMD ["python3", "hello.py"]
