CREATE TABLE "parent" (
  "id" SERIAL PRIMARY KEY,
  "parent_fname" varchar,
  "parent_lname" varchar,
  "email" varchar,
  "phone" varchar,
  "address1" varchar,
  "address2" varchar,
  "city" varchar,
  "state" varchar,
  "zipcode" varchar,
  "last_login" datetime,
  "created_on" datetime,
  "password" varchar
);

CREATE TABLE "child" (
  "id" int PRIMARY KEY,
  "parent_id" int,
  "school_id" int,
  "child_fname" varchar,
  "child_lname" varchar,
  "grade" varchar
);

CREATE TABLE "school" (
  "id" int PRIMARY KEY,
  "school_name" varchar,
  "office_email" varchar,
  "office_phone" varchar,
  "address1" varchar,
  "address2" varchar,
  "city" varchar,
  "state" varchar,
  "zipcode" varchar,
  "school_district" varchar,
  "school_website" varchar,
  "mon_start_am" varchar,
  "mon_end_pm" varchar,
  "tue_start_am" varchar,
  "tue_end_pm" varchar,
  "wed_start_am" varchar,
  "wed_end_pm" varchar,
  "thu_start_am" varchar,
  "thu_end_pm" varchar,
  "fri_start_am" varchar,
  "fri_end_pm" varchar
);

CREATE TABLE "availability" (
  "id" int PRIMARY KEY,
  "parent_id" int,
  "school_id" int,
  "total_spots" int,
  "available_spots" int,
  "ride_date" date,
  "to_school_flag" boolean
);

CREATE TABLE "booked_ride" (
  "id" int PRIMARY KEY,
  "parent_id" int,
  "child_id" int,
  "availability_id" int,
  "booking_date" datetime
);

ALTER TABLE "child" ADD FOREIGN KEY ("parent_id") REFERENCES "parent" ("id");

ALTER TABLE "child" ADD FOREIGN KEY ("school_id") REFERENCES "school" ("id");

ALTER TABLE "availability" ADD FOREIGN KEY ("parent_id") REFERENCES "parent" ("id");

ALTER TABLE "availability" ADD FOREIGN KEY ("school_id") REFERENCES "school" ("id");

ALTER TABLE "booked_ride" ADD FOREIGN KEY ("parent_id") REFERENCES "parent" ("id");

ALTER TABLE "booked_ride" ADD FOREIGN KEY ("child_id") REFERENCES "child" ("id");

ALTER TABLE "booked_ride" ADD FOREIGN KEY ("availability_id") REFERENCES "availability" ("id");
