import { Pool } from 'pg';

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL
})

//Shows the content in db
export async function getAllRows() : Promise<any> {
    return await pool.query('SELECT * FROM urls');
}

export async function insertIntoDb(url : string, token : string) : Promise<void> {
    await pool.query('INSERT INTO urls (short_code, long_url) VALUES ($1, $2)', [token, url]);
}

//Gets the short id from the db
export async function getRedirectId(shortId : string) : Promise<string | null> { 
    const result = await pool.query('SELECT long_url FROM urls WHERE short_code = $1',[shortId]);

    if(result.rows[0])
        return result.rows[0].long_url;
    else
        return null;
}

//Creates tables if not already
export function createTable() : void {
    pool.query('CREATE TABLE IF NOT EXISTS urls ( id SERIAL PRIMARY KEY, short_code TEXT UNIQUE, long_url TEXT )').then(() => console.log("Table created!"));
}

