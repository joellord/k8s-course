create database if not exists images;
grant select, insert, update, delete on images.* to 'user'@'%';
use images;
create table images( id INT AUTO_INCREMENT PRIMARY KEY, caption VARCHAR(100), filename VARCHAR(255) );
insert into images(caption, filename) values("Hello", "hello-caption.gif");
