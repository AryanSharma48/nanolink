export function isValidUrl(input: string) : boolean {
    try {
        const parsedUrl = new URL(input);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    }
    catch(error){
        console.error(error);
        return false;
    }
}