# Лабораторная работа №2

## Цель

Написать 2 Dockerfile:
1. "Плохой" (bad), в котором >= 3 антипаттерна
2. "Хороший" (nice), в котором антипаттерны исправлены

## Выполнение работы

Для начала приведем полностью "плохой" Dockerfile:
```
FROM ubuntu:latest

RUN apt-get update

RUN apt-get install -y python3 
        
ADD . .

CMD ["python3", "hello.py"]
```

А теперь "хороший" Dockerfile:
```
FROM python:3.9.6

RUN apt-get update && pip3 install pyyaml

COPY . .

CMD ["python3", "hello.py"]
```
### Рассмотрим отличия приведенных файлов

1. Использование образа<br>
`FROM ubuntu:latest` 👎<br>
`FROM FROM python:3.9.6` 👍<br>
В первой строке "плохого" Dockerfile'а:<br>
* Использование образа несоразмерно задаче -- целая убунту для запуска питоновского скрипта
* Нет указания конкретной версии -- как постоянная практика может привести к проблемам совместимости в будущем

2. Атомарные RUN'ы<br>
`RUN apt-get update` <br>
`RUN apt-get install -y python3`👎<br>
`RUN apt-get update && pip3 install pyyaml` 👍<br>
Каждый RUN создает новый слой, что раздувает образ.<br>
Каждый новый слой — это актуальная версия образа. А финальный образ — это объединение всех слоев в один.<br>
Каждый слой образа сохраняется, чтобы при необходимости быстро откатываться назад.

4. ADD и COPY<br>
`ADD . .` 👎<br>
`COPY . .` 👍<br>
В целом команды делают то же самое, но ADD может и "лишкануть", например, с распаковкой добавленного архива (хоть в данной задаче у нас его и нет).<br>
Команда COPY, которая просто копирует файлы и директории в контейнер, подходит лучше для нашей задачи.

### Ошибки при работе с контейнерами
Но даже с идеально написанным Dockerfile есть масса возможностей все испортить. Приведем парочку сценариев:
1. Запуск контейенера с правами root-пользователя. Когда мы даем привилегий сверх нужного, то создаем серьезные риски для безопасности. Если злоумышленник получит доступ к контейнеру😮, даже представлять не хочется...
2. Запуск контейнера без ограничений по ресурсам (памяти) может привести к тому, что контейнер будет потрелять все ресурсы хоста, что, само собой, скажется на работе других контейенеров. Кому такое надо??

## Вывод

В результате выполнения работы были получены знания о некоторых базовых командах Dockerfile. Мне понравилось 👍

# Лабораторная работа №2*(со звездочкой)

## Цель

Написать 2 Docker-compose файла:
1. "Плохой" (bad), в котором >= 3 антипаттерна
2. "Хороший" (nice), в котором антипаттерны исправлены
3. Сделать так, чтобы контейнеры в рамках этого compose-проекта поднимались вместе, но не "видели" друг друга по сети

## Выполнение работы

Для начала приведем полностью "плохой" Docker-compose файл:
```
services:
  web:
    image: nginx:latest
    ports:
      - 80:80
    depends_on:
      - db

  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: pwd
    ports:
      - 5432:5432
```

А теперь "хороший" Docker-compose файл:
```
services:
  web:
    image: nginx:1.21.1
    networks:
      - webnet
    ports:
      - 127.0.0.1:80:80
    depends_on:
      - db
	  
  db:
    image: postgres:13.3
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD_FILE: /run/secrets/admin_password
    secrets:
      - admin_password
    networks:
      - dbnet
    ports:
      - 127.0.0.1:5432:5432

networks:
  webnet:
  dbnet:

secrets:
  admin_password:
    file: admin_password.txt
```
### Рассмотрим отличия приведенных файлов

1. Все тот же тег `latest`<br>
`image: nginx:latest` 👎<br>
`image: nginx:1.21.1` 👍<br>
Пора бы уже запомнить, что это плохая практика.<br>

2. Использование портов хоста на адресе `0.0.0.0`<br>
`- 80:80`👎<br>
`- 127.0.0.1:80:80` 👍<br>
Если просто указать порт, то он пробросится с контейнера на хост таким образом, что станет доступным для всех сетевых интерфейсов хоста.<br>
Включая тот интерфейс, что используется для выхода в глобальную сеть Интернет😮.<br>
Если указать `localhost`, то порт останется доступным только для `loopback` интерфейса.

4. Хранение `сенситив информейшен` в compose файле<br>
`POSTGRES_PASSWORD: pwd` 👎<br>
`POSTGRES_PASSWORD_FILE: /run/secrets/admin_password` 👍<br>
Здесь даже и добавить нечего: что если наш compose файл попадет в руки какого-нибудь негодяйского негодяя?..А там пароль.<br>

### Сетевая настройка контейнеров
Контейнеры были изолированы друг друга с помошью `networks`: контейнер с `nginx` образом работает в `webnet`, `postgres` в `dbnet`.

## Вывод

В результате выполнения работы были рассмотрены антипаттерны при работе с Docker-compose файлами. Лайк 👍
