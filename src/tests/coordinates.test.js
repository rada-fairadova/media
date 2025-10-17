import { Coordinates } from '../src/js/coordinates.js';

describe('Coordinates.parseCoordinates', () => {
    test('парсит координаты с пробелом после запятой', () => {
        const result = Coordinates.parseCoordinates('51.50851, -0.12572');
        expect(result.latitude).toBe(51.50851);
        expect(result.longitude).toBe(-0.12572);
    });

    test('парсит координаты без пробела после запятой', () => {
        const result = Coordinates.parseCoordinates('51.50851,-0.12572');
        expect(result.latitude).toBe(51.50851);
        expect(result.longitude).toBe(-0.12572);
    });

    test('парсит координаты в квадратных скобках', () => {
        const result = Coordinates.parseCoordinates('[51.50851, -0.12572]');
        expect(result.latitude).toBe(51.50851);
        expect(result.longitude).toBe(-0.12572);
    });

    test('парсит координаты с пробелами вокруг', () => {
        const result = Coordinates.parseCoordinates('  51.50851 , -0.12572  ');
        expect(result.latitude).toBe(51.50851);
        expect(result.longitude).toBe(-0.12572);
    });

    test('выбрасывает ошибку при неверном количестве координат', () => {
        expect(() => {
            Coordinates.parseCoordinates('51.50851');
        }).toThrow('Координаты должны содержать широту и долготу, разделенные запятой');
    });

    test('выбрасывает ошибку при нечисловых координатах', () => {
        expect(() => {
            Coordinates.parseCoordinates('abc, def');
        }).toThrow('Широта и долгота должны быть числами');
    });

    test('выбрасывает ошибку при неверной широте', () => {
        expect(() => {
            Coordinates.parseCoordinates('91, -0.12572');
        }).toThrow('Широта должна быть в диапазоне от -90 до 90');
    });

    test('выбрасывает ошибку при неверной долготе', () => {
        expect(() => {
            Coordinates.parseCoordinates('51.50851, -181');
        }).toThrow('Долгота должна быть в диапазоне от -180 до 180');
    });

    test('выбрасывает ошибку при пустой строке', () => {
        expect(() => {
            Coordinates.parseCoordinates('');
        }).toThrow('Введите координаты');
    });

    test('выбрасывает ошибку при null', () => {
        expect(() => {
            Coordinates.parseCoordinates(null);
        }).toThrow('Введите координаты');
    });
});