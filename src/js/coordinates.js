export function parseCoordinates(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid input: must be a non-empty string');
    }

    let cleanedInput = input.replace(/[\[\]]/g, '');
    
    const parts = cleanedInput.split(',').map(part => part.trim());
    
    if (parts.length !== 2) {
        throw new Error('Invalid format: must contain exactly one comma separating latitude and longitude');
    }

    const [latStr, lonStr] = parts;

    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lonStr);

    if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates: latitude and longitude must be valid numbers');
    }

    if (latitude < -90 || latitude > 90) {
        throw new Error('Invalid latitude: must be between -90 and 90');
    }

    if (longitude < -180 || longitude > 180) {
        throw new Error('Invalid longitude: must be between -180 and 180');
    }

    return {
        latitude,
        longitude
    };
}