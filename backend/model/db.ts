import { Pool } from 'pg';
import { config } from '../utils/config';

export const pool = new Pool ({
    connectionString: config.DATABASE_URL
})

//Shows the content in db
export async function getAllRows(limit: number = 50, offset: number = 0) : Promise<any> {
    return await pool.query('SELECT * FROM urls ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
}

export async function getAnalytics() : Promise<any> {
    return await pool.query('SELECT urls.*, COUNT(analytics.id) AS total_clicks FROM urls LEFT JOIN analytics ON urls.short_code = analytics.short_code GROUP BY urls.id');
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
