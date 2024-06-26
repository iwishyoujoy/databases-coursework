# Bimbo shop
_Курсовая работа по предмету "Информационные системы и базы данных"_\
_Backend - Батомункуева Виктория, frontend - Скворцова Дарья_

__Тема__ - интернет-магазин, где можно купить не только одежду, аксессуары и другие модные штучки, но и записаться на процедуру на определенное время. 

## Технологии

### Backend
 - Spring Boot
 - Gradle
 - Docker Compose
 - PostgreSQL

### Frontend
 - Next.js (на TypeScipt)
 - Axios
 - Redux
 - react-hot-toast

## Пользовательские сценарии

__Незалогиненный пользователь:__
 - просматривать товары, процедуры в общем списке, сортировать их по категориям
 - просматривать страницы товаров и процедур, а также отзывы на них
 - возможность зарегистрироваться/войти как покупатель, а также как продавец/клиника

__Залогиненный пользователь:__
 - добавлять товары в избранное, удалять товары из избранного
 - написать отзыв на любой товар/процедуру, если ранее на этот товар/процедуру отзыв был не написан
 - добавление товара в корзину через сниппет, а также через страницу товара с выбором количества штук
 - добавление процедуры в корзину через сниппет, а также через страницу процедуры с выбором времени записи
 - просмотр корзины, удаление из товаров/процедур из корзины, увеличение/уменьшение количества товаров, оформление заказа
 - просмотр личных данных в кабинете
 - просмотр оформленных заказов (с изменяющимися статусами)

__Залогиненный продавец/клиника:__
 - просмотр данных продавца/клиники в кабинете
 - просмотр пришедших заказов с возможностью изменения статуса каждого элемента в заказе
 - добавление новых товаров/добавление новых процедур и записей к ним (также есть возможность добавить записи к старым процедурам)
 - просмотр всех имеющихся товаров/процедур

 ## Интерфейс

 [Видео интерфейса](https://drive.google.com/file/d/1IbBMW8W3lzr_dk2ePZbTOm4zIUMpuSbl/view?usp=sharing)

 ### Скриншоты

<img width="1664" alt="Скриншот формы входа/регистрации для пользователей" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/60756d9a-6900-415a-b13b-74f14403ffd2">
<img width="1664" alt="Скриншот корзины пользователя" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/cfa85f61-d3a9-4859-9d69-a426128d6dbc">
<img width="1664" alt="Скриншот оформленного заказа пользователя" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/e917bf9a-7efe-480e-b01d-4b76479eec3d">
<img width="1664" alt="Скриншот списка товаров в категории сумок" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/2ea28ffb-2297-42cc-b1a7-56d805aa4441">
<img width="1664" alt="Скриншот страницы товара" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/747ec906-b5d9-4043-b123-5a5192ca69a8">
<img width="1664" alt="Скриншот страницы процедуры" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/a81e2b45-0ba9-47f8-862d-36d47573c09b">
<img width="1664" alt="Скриншот формы входа/регистрации для продавцов/клиник" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/df10d708-524f-459b-9878-343acb4d0558">
<img width="1664" alt="Скриншот страницы заказов в кабинете продавца" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/b2f0034b-094b-4ec5-9487-c64ab4a77f1a">
<img width="1664" alt="Скриншот страницы товаров для продавца" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/3d279457-82ef-4161-9bbe-4650950f04f1">
<img width="1664" alt="Скриншот модалки для добавления товара" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/0661dd72-c73a-4ece-9ee7-5a1f5b56ecc9">
<img width="1664" alt="Скриншот страницы процедур для клиники" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/d1e185c6-e9d6-4e01-8edc-0243519c4034">
<img width="1664" alt="Скриншот модалки для добавления записей для процедур" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/7b65b152-8e90-4b47-b944-eaaa6cb7a4e7">
<img width="1664" alt="Скриншот модалки для добавления процедуры" src="https://github.com/iwishyoujoy/databases-coursework/assets/92114723/5e5607de-99ad-419c-b993-cb7b1a80f649">

