#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL


CREATE TABLE if not exists Customer (
                                        id SERIAL PRIMARY KEY not null,
                                        name VARCHAR(32) not null,
    surname VARCHAR(32) not null,
    birthday DATE not null,
    phone_number VARCHAR(15) not null,
    login VARCHAR(32) UNIQUE not null,
    password text not null
    );

CREATE TABLE if not exists Bimbo_order(
                                          id SERIAL PRIMARY KEY not null,
                                          customer_id INTEGER REFERENCES Customer(id) not null,
    timestamp TIMESTAMP not null,
    status VARCHAR(32) not null
    );

CREATE TABLE if not exists Item (
                                    id SERIAL PRIMARY KEY,
                                    type VARCHAR(32) not null
    );

CREATE TABLE if not exists Seller (
                                      id SERIAL PRIMARY KEY,
                                      name VARCHAR(64) not null,
    email VARCHAR(32) not null,
    contact VARCHAR(64) not null,
    login VARCHAR(32) UNIQUE not null,
    password text not null
    );


CREATE TABLE if not exists Product_Category (
                                                id SERIAL PRIMARY KEY not null,
                                                name VARCHAR(32) not null,
    description TEXT not null
    );

CREATE TABLE if not exists Product (
                                       id_item integer PRIMARY KEY,
                                       name VARCHAR(64) not null,
    price FLOAT not null,
    description TEXT not null,
    photo_url TEXT not null,
    amount_available INTEGER not null,
    seller_id INTEGER REFERENCES Seller(id) not null,
    product_category_id INTEGER REFERENCES Product_Category(id) not null
    );



CREATE TABLE if not exists Procedure_Category (
                                                  id SERIAL PRIMARY KEY,
                                                  name VARCHAR(32) not null,
    description TEXT not null
    );

CREATE TABLE if not exists Clinic (
                                      id SERIAL PRIMARY KEY,
                                      name VARCHAR(32) not null,
    email VARCHAR(32) not null,
    contact VARCHAR(32) not null,
    login VARCHAR(32) UNIQUE not null,
    password text not null
    );


CREATE TABLE if not exists Procedure (
                                         id SERIAL PRIMARY KEY,
                                         photo_url TEXT not null,
                                         name VARCHAR(64) not null,
    price FLOAT not null,
    procedure_category_id INTEGER REFERENCES Procedure_Category(id),
    clinic_id INTEGER REFERENCES Clinic(id)
    );


CREATE TABLE if not exists Appointment (
                                           item_id integer PRIMARY KEY,
                                           date_time timestamp not null,
                                           procedure_id INTEGER REFERENCES Procedure(id),
    status boolean not null default false
    );


CREATE TABLE if not exists Favorite_Product (
    customer_id INTEGER REFERENCES Customer(id),
    item_id INTEGER REFERENCES Item(id),
    PRIMARY KEY(customer_id , item_id)
    );

CREATE TABLE if not exists Review (
                                      id SERIAL PRIMARY KEY,
                                      customer_id INTEGER REFERENCES Customer(id),
    rating INTEGER not null,
    content TEXT not null,
    item_id INTEGER REFERENCES Item(id)
    );

CREATE TABLE if not exists Item_in_Order (
    order_id INTEGER REFERENCES Bimbo_order(id),
    item_id INTEGER REFERENCES Item(id),
    current_amount INTEGER not null,
    PRIMARY KEY(order_id, item_id)
    );

-- Триггеры

CREATE OR REPLACE FUNCTION add_item_for_product() RETURNS trigger AS \$\$
DECLARE
new_id INTEGER := 0;
BEGIN

INSERT INTO Item(type) VALUES('product');
SELECT id into new_id FROM Item WHERE id = (SELECT MAX(id) FROM Item);
NEW.id_item = new_id;

RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;


CREATE TRIGGER add_item_for_product_trigger
    BEFORE INSERT ON Product
    FOR EACH ROW EXECUTE PROCEDURE add_item_for_product();

CREATE OR REPLACE FUNCTION add_appointment_for_product() RETURNS trigger AS \$\$
DECLARE
new_id INTEGER := 0;
BEGIN
        -- prevent concurrent inserts from multiple transactions
        LOCK TABLE favorite_product IN EXCLUSIVE MODE;

INSERT INTO Item(type) VALUES('appointment');
SELECT id into new_id FROM Item WHERE id = (SELECT MAX(id) FROM Item);
NEW.item_id = new_id;

RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;


CREATE TRIGGER add_item_for_product_trigger
    BEFORE INSERT ON Appointment
    FOR EACH ROW EXECUTE PROCEDURE add_appointment_for_product();

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('Vika', 'Batomunkueva', '2003-07-03', '123456789', 'qwerty', 'qwerty');

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('Dasha', 'Skvortsova', '2003-07-03', '123456789', 'qwerty2', 'qwerty') ;

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('David', 'Kresnikiv', '2003-07-03', '123456789', 'qwerty3', 'qwerty') ;

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('Kim', 'Kardashian', '2003-07-03', '123456789', 'qwerty4', 'qwerty') ;

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('Lina', 'Tovka', '2003-07-03', '123456789', 'qwerty5', 'qwerty') ;

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('Arseniy', 'Superstar', '2003-07-03', '123456789', 'qwerty6', 'qwerty');

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('Beverley', 'Hills', '2003-07-03', '123456789', 'qwerty7', 'qwerty');

INSERT INTO Customer(name, surname, birthday, phone_number, login, password)
VALUES ('Paris', 'Hilton', '2003-07-03', '123456789', 'qwerty8', 'qwerty');


-- Продавцы

INSERT INTO Seller(name, email, contact, login, password)
VALUES ('HYPE', 'hype@gmai.com', 'Hype Beast', 'qwerty', 'qwerty');

INSERT INTO Seller(name, email, contact, login, password)
VALUES ('ANTIHYPE', 'antihype@gmai.com', 'Not Beast', 'qwerty1', 'qwerty');

INSERT INTO Seller(name, email, contact, login, password)
VALUES ('BestBimboSeller', 'bestbimboseller@gmai.com', 'Taylor Swift', 'qwerty2', 'qwerty');

INSERT INTO Seller(name, email, contact, login, password)
VALUES ('Style', 'style@gmai.com', 'Harry Styles', 'qwerty3', 'qwerty');

INSERT INTO Seller(name, email, contact, login, password)
VALUES ('Farfetch', 'farfetch@gmai.com', 'Kanye West', 'qwerty4', 'qwerty');

-- Категории товаров

INSERT INTO Product_Category(name, description)
VALUES ('crop top', 'A flirty, body-loving crop top that makes a bold fashion statement, perfect for those hot summer vibes');

INSERT INTO Product_Category(name, description)
VALUES ('heels', 'Step up your game and strut like a queen with our crush-worthy heels to make you fall in love with every step you take');

INSERT INTO Product_Category(name, description)
VALUES ('skirt', 'Your new style obsession - our range of skirts are here to make every girl is heart skip a beat');

INSERT INTO Product_Category(name, description)
VALUES ('jeans', 'Find your perfect denim soulmate with our range of jeans - they more than clothing, they are a way of life');

INSERT INTO Product_Category(name, description)
VALUES ('lipstick', 'Make a bold statement with our lipsticks - they are not just about makeup, they are about embracing your diva');

INSERT INTO Product_Category(name, description)
VALUES ('eyeshadow', 'Unleash your inner artist with our range of eyeshadows - for eyes that steal all the spotlight');

INSERT INTO Product_Category(name, description)
VALUES ('perfume', 'Allure your senses and leave a lasting impression with our range of perfumes - because you are worth it');

INSERT INTO Product_Category(name, description)
VALUES ('highlighter', 'Accentuate your beauty with our highlighter range - because nothing stands in the way of a girl who wants to shine');

INSERT INTO Product_Category(name, description)
VALUES ('bag', 'Make a fashion statement with our collection of bags - there is a perfect bag for every outfit, every mood, and every moment');

-- Клиники

INSERT INTO Clinic (name, email, contact, login, password)
VALUES ('Glam Clinic', 'info@glamclinic.com', '+15558888888', 'glamclinic', 'glampassword');

INSERT INTO Clinic (name, email, contact, login, password)
VALUES ('Beauty Spot', 'beauty@spot.com', '+15557777777', 'beautyspot', 'beautySecret');

INSERT INTO Clinic (name, email, contact, login, password)
VALUES ('Sparkle First', 'contact@sparklefirst.com', '+15556666666', 'sparklefirst', 'sparkleCode');

INSERT INTO Clinic (name, email, contact, login, password)
VALUES ('Dazzle Realm', 'dazzle@dazzlerealm.com', '+15554444444', 'dazzlerealm', 'dazzleBeyond');

INSERT INTO Clinic (name, email, contact, login, password)
VALUES ('Glow On Top', 'glow@ontop.com', '+15559999999', 'glowontop', 'beyourgL0W');

-- Категории процедур

INSERT INTO Procedure_Category (name, description)
VALUES ('Lip Fillers', 'For the perfect, kissable and sensational lips that command attention');

INSERT INTO Procedure_Category (name, description)
VALUES ('Skin Glow', 'For skin that radiates youth, health and pulls in compliments wherever you go');

INSERT INTO Procedure_Category (name, description)
VALUES ('Hair Extensions', 'For mermaid tresses that sway with beauty and enchant everyone in the room');

INSERT INTO Procedure_Category (name, description)
VALUES ('Nail Spa', 'For pretty and pampered nails that add that touch of glam to every gesture');

INSERT INTO Procedure_Category (name, description)
VALUES ('Eyelash Extensions', 'For fluttering and gorgeous eyelashes that frame your sparkling eyes');

-- Процедуры

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Perfect Pout Lip Fillers', 250.00, 'https://i.pinimg.com/564x/87/83/2c/87832c5573cb7f2ce17e4e411ed46258.jpg', 1, 1);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Glossy Gloss Skin Glow', 150.00, 'https://i.pinimg.com/564x/8c/b2/be/8cb2be141660c7e0a67a9b3b3c514adb.jpg', 2, 2);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Mermaid Waves Hair Extensions', 350.00, 'https://i.pinimg.com/564x/42/05/8e/42058e4d2e2795128be63e9150efa955.jpg', 3, 3);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Princess Nails', 100.00, 'https://i.pinimg.com/564x/67/b3/7b/67b37b4ec56a753dab7cdcf886ec857f.jpg', 4, 5);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Butterfly Eyelash Extensions', 120.00, 'https://i.pinimg.com/564x/92/47/b3/9247b33241de14b5e7107c8cfb51b4b7.jpg', 5, 4);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Romantic Rose Lip Fillers', 200.00, 'https://i.pinimg.com/564x/92/f7/38/92f738e2075bf7b8545e1679a72ac991.jpg', 1, 2);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Twilight Transform Skin Glow', 200.00, 'https://i.pinimg.com/564x/46/f8/0e/46f80e63125e292b36275ff2ca95d4f7.jpg', 2, 3);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Rapunzel Dream Hair Extensions', 400.00, 'https://i.pinimg.com/564x/d3/90/95/d390950e885e53a8250a6f7ddc86fb24.jpg', 3, 4);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Glitter Goddess Nails', 75.00, 'https://i.pinimg.com/564x/b2/9b/41/b29b41f95f61740a28ed2a7d0a645689.jpg', 4, 1);

INSERT INTO Procedure (name, price, photo_url, procedure_category_id, clinic_id)
VALUES ('Sweet Whisper Eyelash Extensions', 150.00, 'https://i.pinimg.com/564x/10/15/63/1015634cee6cdb95fd2aa01b8be86bde.jpg', 5, 5);

-- Товары

INSERT INTO Product(id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id)
VALUES (0, 'gorgeous pink crop top', 'Embrace your inner diva with our Gorgeous Pink Crop Top. Its vibrant hue and elegant design make it a statement piece that is sure to turn heads.', 'https://i.pinimg.com/564x/81/ea/86/81ea869700df6b3868987479f7cf7908.jpg', 100, 1500, 1, 1);

INSERT INTO Product(id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id)
VALUES (0, 'red Louboutins', 'Step into luxury with our Red Louboutins. Their sleek design and high-quality material make them the perfect accessory for any occasion.', 'https://i.pinimg.com/564x/c8/99/5c/c8995cc2eaefdddc62a44ffa81fd8f2f.jpg', 150, 7000, 1, 2);

INSERT INTO Product(id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id)
VALUES (0, 'Yves Saint Laurent Baby Doll', 'Exude sophistication with our Yves Saint Laurent Baby Doll. Its elegant design and high-quality materials make it a must-have for any fashion enthusiast.', 'https://avatars.mds.yandex.net/get-mpic/4453979/img_id7874783838998786467.jpeg/600x600', 100, 20000, 1, 7);

INSERT INTO Product(id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id)
VALUES (0, 'sparkly lipstick in pinkish color', 'Make a bold statement with our Sparkly Lipstick in Pinkish Color. Its vibrant color and sparkly finish make it a stunning addition to any makeup routine.', 'https://i.pinimg.com/564x/40/6d/6a/406d6a967aa702b6b59fb2a7aee2a25b.jpg', 1000, 700, 1, 5);

INSERT INTO Product(id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id)
VALUES (0, 'low-wasted blue jeans', 'Show off your style with our Low-Wasted Blue Jeans with Diamonds. Their unique diamond detail and comfortable fit make them a fashionable choice.', 'https://i.pinimg.com/564x/8e/82/dd/8e82dda5ecf16ffcc3ce9d86d88a523d.jpg', 100, 123, 2, 4);


INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Crop Top Red', 'Lovely red croptop with a flattering cut', 'https://i.pinimg.com/564x/98/e2/34/98e234c5968880a151565cdf1a9986bb.jpg', 100, 2500.50, 2, 1);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Black High Heel', 'Stylish black heels with anti-slip soles', 'https://i.pinimg.com/564x/bd/3f/50/bd3f5054c9946762a505034345596bf9.jpg', 100, 4900.99, 2, 2);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Blue Denim Skirt', 'Comfortable blue denim skirt with pockets', 'https://i.pinimg.com/564x/48/4e/48/484e4866ea2209be817a311cf63ab2f6.jpg', 100, 3400.99, 3, 3);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Funny Crop Top', 'Cute pink croptop with flattering cut and humorous pattern', 'https://i.pinimg.com/564x/d4/41/4b/d4414bd58ecaf3522c6de486b19014d4.jpg', 10, 2300.50, 3, 1);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Fancy Heels', 'Sparkling heels with gold finish and unicorn design', 'https://i.pinimg.com/564x/17/23/86/172386dcda576256e949378968b716f3.jpg', 6, 5500.99, 4, 2);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Pretty Skirt', 'Pink floral skirt with ruffles and butterfly print', 'https://i.pinimg.com/564x/50/f9/ec/50f9ecccb2887d5bc6ad41ccc06fd145.jpg', 14, 3900.90, 5, 3);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Trendy Jeans', 'Light blue jeans with stars and galaxy print', 'https://i.pinimg.com/564x/87/a7/4d/87a74d86a55960862540147be6e6a38a.jpg', 21, 5700.95, 4, 4);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Delightful Lipstick', 'Sweet pink lipstick with heart shaped tip and love letter print', 'https://i.pinimg.com/564x/69/1a/d5/691ad567724359ea9b89615bba463ef1.jpg', 35, 1500.99, 5, 5);

INSERT INTO Product (id_item, name, description, photo_url, amount_available, price, seller_id, product_category_id) VALUES (0, 'Glamorous Eye Shadow', 'Purple eyeshadow with sparkles and starry night print', 'https://i.pinimg.com/564x/2e/4f/51/2e4f517497c8ef5abc2b758d5d134a88.jpg', 48, 1100, 5, 6);


-- Записи

INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-12 09:00:00', 1);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-13 14:00:00', 3);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-13 17:30:00', 3);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-14 11:30:00', 4);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-15 12:00:00', 10);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-15 12:00:00', 2);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-15 13:00:00', 5);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-16 18:00:00', 6);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-12 15:30:00', 7);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-13 14:00:00', 9);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-13 13:30:00', 9);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-14 17:30:00', 8);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-15 19:30:00', 7);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-15 12:30:00', 4);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-15 12:45:00', 4);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-15 13:00:00', 6);
INSERT INTO Appointment (item_id,date_time, procedure_id) VALUES (1,'2023-10-16 14:30:00', 6);

-- Избранное

INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 1);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 13);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 12);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 2);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 3);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 4);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 5);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 6);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 7);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (1, 8);

INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (2, 15);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (2, 7);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (2, 8);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (3, 9);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (3, 21);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (3, 23);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (4, 18);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (4, 12);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (4, 14);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (5, 15);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (5, 24);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (5, 1);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (6, 4);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (6, 6);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (6, 7);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (7, 10);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (7, 17);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (7, 14);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (8, 13);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (8, 4);
INSERT INTO Favorite_Product (customer_id, item_id)
VALUES (8, 3);

-- Отзывы

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (1, 5, 'Oh My Gloss! The Perfect Pout Lip Fillers at Glam Clinic gave me fabulous and irresistibly luscious lips! I am in love!', 15);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (2, 4, 'OMG! I tried the sparkly crop top and it made me feel like a true queen! All the girls were so jelly at the party!', 1);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (3, 5, 'These heels are to die for! Every step you take feels like a strut on the fashion runway! Loved the attention I got!', 2);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (4, 5, 'Twilight Transform Skin Glow gave me a blemish-free and radiant skin that even made the moon jealous! Can not wait for my next session!', 23);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (5, 4, 'No more bad hair days! Thanks to the Mermaid Waves Hair Extensions from Sparkle First. They are a true fairytale come alive.', 17);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (6, 5, 'The skirts from this shop are like wishes come true. They are so pretty, I just can not get enough of twirling in them!', 8);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (5, 4, 'The jeans are beyond comfy. Paired it with my pink halter top and my beau could not stop complimenting me. XOXO!', 5);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (4, 5, 'The eyeshadow palette was divine! The combination of shades let my eyes do all the talking. An absolute must for all glam occasions!', 14);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (1, 5, 'The lipstick was a show stopper! It lasted for a good 7 hours and I did not have to deal with my lips drying out. Super happy with this purchase!', 4);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (2, 5, 'The lipstick I purchased was the best!', 13);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (1, 5, 'The lipstick is amazing! It gives my lips a beautiful and natural shine. I highly recommend it.', 4);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (2, 4, 'I bought these jeans and they are perfect for any occasion. They are super soft and stylish.', 5);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (3, 5, 'The eye shadow palette is a must-have for every makeup lover. The colors are rich and long-lasting.', 14);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (4, 5, 'The skirt is absolutely stunning! It fits perfectly and the fabric is so soft. Love it!', 8);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (5, 4, 'The shoes are incredibly comfortable and stylish. I received positive feedback from everyone who saw them.', 10);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (6, 5, 'Just an incredible red crop top, I've never felt so attractive! All the guys were watching me in the club!', 6);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (7, 4, 'What amazing black heels, I went to them on the red carpet of the movie where I was filming and everyone asked where I got them! I said that all the cool stuff can be found on the bimbo shop!', 7);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (8, 5, 'The blouse is so comfortable and lightweight. It fits perfectly and is a great addition to my wardrobe.', 1);

-- Reviews for "Perfect Pout Lip Fillers"

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (1, 5, 'Oh My Gloss! These little lip fillers were just fantastic! I am in love!', 15);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (2, 4, 'I was beyond thrilled with the result. It was simply magical!', 15);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (3, 5, 'This was simply the best thing I have ever done with my face. My lips looked so much fuller and more attractive after this.', 15);

-- Reviews for "Glossy Gloss Skin Glow"

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (4, 5, 'My skin became simply unbelievable after this procedure. It looked healthy and fresh!', 20);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (5, 4, 'I was surprised at how quickly my skin started to glow. This was truly a magical experience!', 20);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (6, 5, 'I was completely enchanted by this product. My skin became soft and shiny.', 20);

-- Reviews for "Mermaid Waves Hair Extensions"

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (7, 5, 'This was simply fantastic! My hair became so much longer and silky.', 16);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (8, 4, 'I was surprised at how realistic my hair looked after this. This was truly a magical experience!', 17);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (9, 5, 'I was completely enchanted by this product. My hair became soft and silky.', 16);

-- Reviews for "Princess Nails"

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (1, 5, 'These little princess nails were just fantastic! They made my fingers look so pretty and elegant.', 18);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (2, 4, 'I was beyond thrilled with the result. My fingers looked so much more stylish and sophisticated after this.', 28);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (3, 5, 'This was simply the best thing I have ever done with my hands. I felt like a queen after this.', 29);

-- Reviews for "Butterfly Eyelash Extensions"

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (4, 5, 'These little butterfly eyelash extensions were just fantastic! They made my eyes look so much more dramatic and stunning.', 21);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (5, 4, 'I was beyond thrilled with the result. My eyes looked so much more expressive and beautiful after this.', 21);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (6, 5, 'This was simply the best thing I have ever done with my eyelashes. I felt like a beauty queen after this.', 21);

-- Reviews for "Romantic Rose Lip Fillers"

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (7, 5, 'These little romantic rose lip fillers were just fantastic! They made my lips look so much more rosy and romantic.', 22);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (8, 4, 'I was beyond thrilled with the result. My lips looked so much more soft and kissable after this.', 31);

INSERT INTO Review (customer_id, rating, content, item_id)
VALUES (2, 4, 'I was beyond thrilled with the result. It was simply magical!', 30);


-- Заказы
-- 'Starting to Sparkle' (не оформлен), 'Glam in Progress' (Оформлен), 'Glowing and Going' (Собран), 'Ready to Slay' (Получен).

INSERT INTO Bimbo_order (customer_id, timestamp, status)
VALUES (1, TIMESTAMP '2021-8-10 10:23:12', 'Starting to Sparkle');

INSERT INTO Bimbo_order (customer_id, timestamp, status)
VALUES (2, TIMESTAMP '2021-8-15 14:17:45', 'Glam in Progress');

INSERT INTO Bimbo_order (customer_id, timestamp, status)
VALUES (3, TIMESTAMP '2021-8-18 16:45:30', 'Glowing and Going');

INSERT INTO Bimbo_order (customer_id, timestamp, status)
VALUES (4, TIMESTAMP '2021-8-20 9:10:05', 'Ready to Slay');

INSERT INTO Bimbo_order (customer_id, timestamp, status)
VALUES (5, TIMESTAMP '2021-8-23 11:30:16', 'Starting to Sparkle');


-- Item in Order

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (1, 1, 3);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (1, 2, 2);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (1, 3, 1);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (1, 4, 4);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (2, 5, 1);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (2, 6, 3);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (2, 7, 2);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (3, 8, 1);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (3, 9, 3);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (3, 10, 2);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (4, 11, 1);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (4, 12, 2);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (4, 13, 3);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (5, 14, 1);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (5, 15, 3);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (5, 16, 2);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (5, 17, 1);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (5, 18, 2);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (5, 19, 1);

INSERT INTO Item_in_Order (order_id, item_id, current_amount)
VALUES (5, 20, 3);

EOSQL