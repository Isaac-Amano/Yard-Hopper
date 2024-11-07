CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
   );
   CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    phone_number VARCHAR(20) NOT NULL,
    image_url_1 TEXT,  
    image_url_2 TEXT,  
    image_url_3 TEXT,  
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES "user" (id),  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
