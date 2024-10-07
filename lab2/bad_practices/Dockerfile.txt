FROM ubuntu:latest

RUN apt-get update

RUN apt-get install -y python3 
        
ADD . .

CMD ["python3", "hello.py"]
