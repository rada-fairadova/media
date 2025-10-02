import { parseCoordinates } from '../js/coordinates.js';

describe('parseCoordinates', () => {
    test('should parse coordinates with space after comma', () => {
        const input = '51.50851, -0.12572';
        const result = parseCoordinates(input);
        
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('should parse coordinates without space after comma', () => {
        const input = '51.50851,-0.12572';
        const result = parseCoordinates(input);
        
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('should parse coordinates with square brackets', () => {
        const input = '[51.50851, -0.12572]';
        const result = parseCoordinates(input);
        
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('should throw error for invalid format without comma', () => {
        const input = '51.50851 -0.12572';
        
        expect(() => {
            parseCoordinates(input);
        }).toThrow('Invalid format: must contain exactly one comma separating latitude and longitude');
    });

    test('should throw error for non-numeric coordinates', () => {
        const input = 'abc, def';
        
        expect(() => {
            parseCoordinates(input);
        }).toThrow('Invalid coordinates: latitude and longitude must be valid numbers');
    });

    test('should throw error for out-of-range latitude', () => {
        const input = '91.0, 0.0';
        
        expect(() => {
            parseCoordinates(input);
        }).toThrow('Invalid latitude: must be between -90 and 90');
    });

    test('should throw error for out-of-range longitude', () => {
        const input = '0.0, 181.0';
        
        expect(() => {
            parseCoordinates(input);
        }).toThrow('Invalid longitude: must be between -180 and 180');
    });

    test('should throw error for empty input', () => {
        const input = '';
        
        expect(() => {
            parseCoordinates(input);
        }).toThrow('Invalid input: must be a non-empty string');
    });

    test('should throw error for non-string input', () => {
        expect(() => {
            parseCoordinates(123);
        }).toThrow('Invalid input: must be a non-empty string');
    });
});