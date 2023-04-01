/*
select r_id from res_lubbock_main order by r_id;
update res_lubbock_main set r_id = r_id-34244 ;
select * from res_menus_lubbock_main order by r_id;
update res_menus_lubbock_main set r_id = r_id-34244 ;
select * from res_cat_lubbock_main order by rd_id;
update res_cat_lubbock_main set rd_id = rd_id-34244;

update res_lubbock_main set score = 4.2 where score is NULL
update res_lubbock_main set ratings  = 0  where ratings IS NULL
*/

commit;

--name_id
select r_id, name_id||',' from res_lubbock_main order by r_id

--score
select r_id, score*10 from res_lubbock_main order by r_id;

--ratings
select r_id, ratings||',' from res_lubbock_main order by r_id;

--price_range
select r_id, length(price_range)||',' from res_lubbock_main order by r_id;

--ful address
select r_id, full_address, full_address_id||',' from res_lubbock_main order by r_id;

--zipcode
select r_id, zip_code, zip_code_id||',' from res_lubbock_main order by r_id;

--category
select distinct name, name_id||',',rd_id from res_cat_lubbock_main order by rd_id;

--food category
select distinct category, category_id||',' , r_id from res_menus_lubbock_main

--food description
select distinct description, description_id||',' , r_id from res_menus_lubbock_main

--food item
select distinct name, name_id||',' , r_id from res_menus_lubbock_main

--food price
select distinct cast(round(price_usd) as INTEGER)||',' , r_id from res_menus_lubbock_main

--name_id
select 'name('||r_id||','||name_id||').' from res_lubbock_main order by r_id

--position_id_id
select 'position('||r_id||','||position||').' from res_lubbock_main order by r_id

--score
select 'score('||r_id||','|| (cast((score*10) as INTEGER))||').' from res_lubbock_main order by r_id;

--ratings
select 'ratings('||r_id||','|| ratings||').' from res_lubbock_main order by r_id;

--price_range
select 'priceRange('||r_id||','|| length(price_range)||').' from res_lubbock_main order by r_id;

--ful address
select 'fullAddress('||r_id||','||full_address_id||').' from res_lubbock_main order by r_id;

--zipcode
select 'zipcode('||r_id||','||zip_code_id||').' from res_lubbock_main order by r_id;

--category
select  'category('||rd_id||','||name_id||').',rd_id from res_cat_lubbock_main order by rd_id;

--category
select distinct name, name_id||',',rd_id from res_cat_lubbock_main order by rd_id;

--food category
select  'hasFoodCategory('||r_id ||','|| category_id||').' , r_id from res_menus_lubbock_main

--food description
select  'description('||name_id ||','|| description_id||').' , r_id from res_menus_lubbock_main
select distinct description, description_id||',' , r_id from res_menus_lubbock_main

--food item
select  'categoryHasItem('||category_id ||','|| name_id||').' , r_id from res_menus_lubbock_main

--food item
select  'hasItem('||r_id ||','|| name_id||').' , r_id from res_menus_lubbock_main

--food price
select  'price('||name_id ||','||cast(round(price_usd) as INTEGER) ||').' , r_id from res_menus_lubbock_main
select distinct cast(round(price_usd) as INTEGER)||',' , r_id from res_menus_lubbock_main


