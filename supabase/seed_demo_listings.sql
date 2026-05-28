create extension if not exists "uuid-ossp";

with demo_owner as (
  insert into profiles (id, email, password_hash, full_name, phone, role, region)
  values (
    '00000000-0000-4000-8000-000000000001',
    'demo-seller@geoauto.local',
    '$2a$12$kdbK.1r1A9PJATMYmZYmX.xUHaXP0SjrTy46.3m9iLLOPdy8rEeZ6',
    'GeoAuto Demo Seller',
    '+998 90 123 45 67',
    'USER',
    'Toshkent'
  )
  on conflict (email) do update
    set full_name = excluded.full_name,
        phone = excluded.phone,
        region = excluded.region
  returning id
),
upserted_listings as (
  insert into listings (
    id,
    owner_id,
    title,
    brand,
    model,
    year,
    price_usd,
    mileage_km,
    region,
    district,
    address,
    latitude,
    longitude,
    fuel_type,
    transmission,
    body_type,
    color,
    engine_liters,
    description,
    is_premium,
    is_top,
    status,
    view_count
  )
  values
    ('10000000-0000-4000-8000-000000000001', (select id from demo_owner), 'Chevrolet Cobalt 2023, ideal holatda', 'Chevrolet', 'Cobalt', 2023, 12800, 18000, 'Toshkent', 'Chilonzor', 'Chilonzor tumani', 41.2855, 69.2031, 'PETROL', 'AUTOMATIC', 'SEDAN', 'Oq', 1.5, 'Demo e''lon. Avtomobil toza saqlangan, salon ozoda, barcha hujjatlari tayyor. Shahar ichida yurilgan va texnik ko''rikdan o''tgan.', true, true, 'ACTIVE', 42),
    ('10000000-0000-4000-8000-000000000002', (select id from demo_owner), 'Kia K5 2022 GT Line', 'Kia', 'K5', 2022, 26500, 32000, 'Toshkent', 'Yunusobod', 'Yunusobod tumani', 41.3652, 69.2875, 'PETROL', 'AUTOMATIC', 'SEDAN', 'Qizil', 2.0, 'Demo e''lon. Komfort saloni, yaxshi komplektatsiya, kundalik foydalanish uchun qulay va tejamkor sedan.', true, false, 'ACTIVE', 31),
    ('10000000-0000-4000-8000-000000000003', (select id from demo_owner), 'Hyundai Tucson 2021 AWD', 'Hyundai', 'Tucson', 2021, 30200, 45000, 'Samarqand', 'Samarqand shahri', 'Registon atrofida', 39.6542, 66.9597, 'PETROL', 'AUTOMATIC', 'SUV', 'Yashil', 2.0, 'Demo e''lon. Oilaviy SUV, baland klirens, keng salon va barqaror yurish xususiyatlariga ega.', false, true, 'ACTIVE', 56),
    ('10000000-0000-4000-8000-000000000004', (select id from demo_owner), 'Toyota Camry 2020 business class', 'Toyota', 'Camry', 2020, 28500, 61000, 'Toshkent', 'Mirobod', 'Mirobod bozori yaqinida', 41.2995, 69.2847, 'HYBRID', 'AUTOMATIC', 'SEDAN', 'Kulrang', 2.5, 'Demo e''lon. Yumshoq yuradi, yoqilg''i sarfi yaxshi, biznes klass sedan qidirayotganlar uchun mos.', false, false, 'ACTIVE', 28),
    ('10000000-0000-4000-8000-000000000005', (select id from demo_owner), 'BYD Song Plus Champion Edition', 'BYD', 'Song Plus', 2024, 33800, 7000, 'Toshkent', 'Sergeli', 'Sergeli avtosalonlar hududi', 41.2267, 69.2196, 'ELECTRIC', 'AUTOMATIC', 'SUV', 'To''q sariq', null, 'Demo e''lon. Zamonaviy elektr SUV, yangi holatga yaqin, shahar va uzoq yo''l uchun qulay.', true, true, 'ACTIVE', 73),
    ('10000000-0000-4000-8000-000000000006', (select id from demo_owner), 'Chevrolet Malibu 2 Premier', 'Chevrolet', 'Malibu', 2021, 24200, 39000, 'Buxoro', 'Buxoro shahri', 'Markaziy ko''cha', 39.7681, 64.4556, 'PETROL', 'AUTOMATIC', 'SEDAN', 'Binafsha', 2.0, 'Demo e''lon. Kuchli motor, qulay salon, yaxshi saqlangan va servis tarixi mavjud.', false, false, 'ACTIVE', 19),
    ('10000000-0000-4000-8000-000000000007', (select id from demo_owner), 'Nissan Patrol 2019 4x4', 'Nissan', 'Patrol', 2019, 45500, 84000, 'Namangan', 'Namangan shahri', 'Bobur shoh ko''chasi', 41.0011, 71.6726, 'PETROL', 'AUTOMATIC', 'SUV', 'Ko''k', 4.0, 'Demo e''lon. Yo''ltanlamas, keng salon, sayohat va oilaviy foydalanish uchun juda qulay.', true, false, 'ACTIVE', 64),
    ('10000000-0000-4000-8000-000000000008', (select id from demo_owner), 'Mercedes-Benz E 300 AMG', 'Mercedes-Benz', 'E 300', 2020, 49800, 52000, 'Toshkent', 'Shayxontohur', 'Shayxontohur tumani', 41.3275, 69.2428, 'PETROL', 'AUTOMATIC', 'SEDAN', 'Pushti', 2.0, 'Demo e''lon. Premium salon, boy komplektatsiya, texnik holati yaxshi va ko''rinishi chiroyli.', true, false, 'ACTIVE', 88),
    ('10000000-0000-4000-8000-000000000009', (select id from demo_owner), 'Lacetti Gentra 2022, gaz-benzin', 'Chevrolet', 'Gentra', 2022, 11600, 47000, 'Farg''ona', 'Farg''ona shahri', 'Yangi bozor yaqinida', 40.3894, 71.7874, 'GAS', 'MANUAL', 'SEDAN', 'Yashil', 1.5, 'Demo e''lon. Tejamkor, ehtiyot qismlari arzon, kundalik ish va oila uchun yaxshi variant.', false, false, 'ACTIVE', 37),
    ('10000000-0000-4000-8000-000000000010', (select id from demo_owner), 'BMW X5 xDrive40i 2021', 'BMW', 'X5', 2021, 69000, 35000, 'Toshkent', 'Yakkasaroy', 'Yakkasaroy tumani', 41.2859, 69.2585, 'PETROL', 'AUTOMATIC', 'SUV', 'Sariq', 3.0, 'Demo e''lon. Premium SUV, kuchli dinamika, komfort paket va yaxshi saqlangan salon.', true, true, 'ACTIVE', 95)
  on conflict (id) do update
    set title = excluded.title,
        brand = excluded.brand,
        model = excluded.model,
        year = excluded.year,
        price_usd = excluded.price_usd,
        mileage_km = excluded.mileage_km,
        region = excluded.region,
        district = excluded.district,
        address = excluded.address,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        fuel_type = excluded.fuel_type,
        transmission = excluded.transmission,
        body_type = excluded.body_type,
        color = excluded.color,
        engine_liters = excluded.engine_liters,
        description = excluded.description,
        is_premium = excluded.is_premium,
        is_top = excluded.is_top,
        status = excluded.status,
        view_count = excluded.view_count
  returning id
)
insert into listing_images (id, listing_id, url, path, sort_order)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '/demo-cars/car-01.svg', 'demo-cars/car-01.svg', 0),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '/demo-cars/car-02.svg', 'demo-cars/car-02.svg', 0),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', '/demo-cars/car-03.svg', 'demo-cars/car-03.svg', 0),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', '/demo-cars/car-04.svg', 'demo-cars/car-04.svg', 0),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', '/demo-cars/car-05.svg', 'demo-cars/car-05.svg', 0),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000006', '/demo-cars/car-06.svg', 'demo-cars/car-06.svg', 0),
  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000007', '/demo-cars/car-07.svg', 'demo-cars/car-07.svg', 0),
  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000008', '/demo-cars/car-08.svg', 'demo-cars/car-08.svg', 0),
  ('20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000009', '/demo-cars/car-09.svg', 'demo-cars/car-09.svg', 0),
  ('20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000010', '/demo-cars/car-10.svg', 'demo-cars/car-10.svg', 0)
on conflict (id) do update
  set url = excluded.url,
      path = excluded.path,
      sort_order = excluded.sort_order;
