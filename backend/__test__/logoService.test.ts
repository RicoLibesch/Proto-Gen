//Importing the Controller
import {pool} from '../src/config/postgresConfig';
import {selectLogo, updateLogo} from "../src/services/logoService";

//mocking the  Service
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the logoService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('updateLogo - should correctly update the logo (no logo)', async () => {
        const testLogo = "";

        mockPoolQuery.mockResolvedValueOnce({rowCount: 1});
        await updateLogo(testLogo);

        const res = testLogo.replace(/^data:image\/png;base64,/, '');
        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE logo SET image = decode($1, \'base64\') WHERE id = $2', [res, 1]);
    });

    it('updateLogo - should correctly update the logo', async () => {
        const testLogo = "V2UncmUgbm8gc3RyYW5nZXJzIHRvIGxvdmUKWW91IGtub3cgdGhlIHJ1bGVzIGFuZCBzbyBkbyBJCkEgZnVsbCBjb21taXRtZW50J3Mgd2hhdCBJJ20gdGhpbmtpbmcgb2YKWW91IHdvdWxkbid0IGdldCB0aGlzIGZyb20gYW55IG90aGVyIGd1eQpJIGp1c3Qgd2FubmEgdGVsbCB5b3UgaG93IEknbSBmZWVsaW5nCkdvdHRhIG1ha2UgeW91IHVuZGVyc3RhbmQKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91CldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkFuZCBpZiB5b3UgYXNrIG1lIGhvdyBJJ20gZmVlbGluZwpEb24ndCB0ZWxsIG1lIHlvdSdyZSB0b28gYmxpbmQgdG8gc2VlCk5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQpOZXZlciBnb25uYSB0ZWxsIGEgbGllIGFuZCBodXJ0IHlvdQpOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSwgbmV2ZXIgZ29ubmEgZ2l2ZQooR2l2ZSB5b3UgdXApCldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkkganVzdCB3YW5uYSB0ZWxsIHlvdSBob3cgSSdtIGZlZWxpbmcKR290dGEgbWFrZSB5b3UgdW5kZXJzdGFuZApOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91Ck5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQ==";

        mockPoolQuery.mockResolvedValueOnce({rowCount: 1});
        await updateLogo(testLogo);

        const res = testLogo.replace(/^data:image\/png;base64,/, '');
        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE logo SET image = decode($1, \'base64\') WHERE id = $2', [res, 1]);
    });

    it('updateLogo - should throw an error because an error occurred', async () => {
        const testLogo = "V2UncmUgbm8gc3RyYW5nZXJzIHRvIGxvdmUKWW91IGtub3cgdGhlIHJ1bGVzIGFuZCBzbyBkbyBJCkEgZnVsbCBjb21taXRtZW50J3Mgd2hhdCBJJ20gdGhpbmtpbmcgb2YKWW91IHdvdWxkbid0IGdldCB0aGlzIGZyb20gYW55IG90aGVyIGd1eQpJIGp1c3Qgd2FubmEgdGVsbCB5b3UgaG93IEknbSBmZWVsaW5nCkdvdHRhIG1ha2UgeW91IHVuZGVyc3RhbmQKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91CldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkFuZCBpZiB5b3UgYXNrIG1lIGhvdyBJJ20gZmVlbGluZwpEb24ndCB0ZWxsIG1lIHlvdSdyZSB0b28gYmxpbmQgdG8gc2VlCk5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQpOZXZlciBnb25uYSB0ZWxsIGEgbGllIGFuZCBodXJ0IHlvdQpOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSwgbmV2ZXIgZ29ubmEgZ2l2ZQooR2l2ZSB5b3UgdXApCldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkkganVzdCB3YW5uYSB0ZWxsIHlvdSBob3cgSSdtIGZlZWxpbmcKR290dGEgbWFrZSB5b3UgdW5kZXJzdGFuZApOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91Ck5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQ==";

        mockPoolQuery.mockRejectedValue(new Error("Error updating Logo"));

        let error;
        try {
            await updateLogo(testLogo)
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('updateLogo - should throw Sql Error rowCount 0', async () => {
        const testLogo = "V2UncmUgbm8gc3RyYW5nZXJzIHRvIGxvdmUKWW91IGtub3cgdGhlIHJ1bGVzIGFuZCBzbyBkbyBJCkEgZnVsbCBjb21taXRtZW50J3Mgd2hhdCBJJ20gdGhpbmtpbmcgb2YKWW91IHdvdWxkbid0IGdldCB0aGlzIGZyb20gYW55IG90aGVyIGd1eQpJIGp1c3Qgd2FubmEgdGVsbCB5b3UgaG93IEknbSBmZWVsaW5nCkdvdHRhIG1ha2UgeW91IHVuZGVyc3RhbmQKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91CldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkFuZCBpZiB5b3UgYXNrIG1lIGhvdyBJJ20gZmVlbGluZwpEb24ndCB0ZWxsIG1lIHlvdSdyZSB0b28gYmxpbmQgdG8gc2VlCk5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQpOZXZlciBnb25uYSB0ZWxsIGEgbGllIGFuZCBodXJ0IHlvdQpOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSwgbmV2ZXIgZ29ubmEgZ2l2ZQooR2l2ZSB5b3UgdXApCldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkkganVzdCB3YW5uYSB0ZWxsIHlvdSBob3cgSSdtIGZlZWxpbmcKR290dGEgbWFrZSB5b3UgdW5kZXJzdGFuZApOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91Ck5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQ==";

        mockPoolQuery.mockResolvedValueOnce({rowCount: 0});

        let error;
        try {
            await updateLogo(testLogo)
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });


    it('selectLogo - should correctly return the logo (no logo)', async () => {
        const testLogo = "";

        mockPoolQuery.mockResolvedValueOnce({rows: [{encode: testLogo}]});
        const res = await selectLogo();

        expect(res).toEqual(`data:image/png;base64,${testLogo}`);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT encode(image, \'base64\') FROM logo WHERE id = $1', [1]);
    });

    it('selectLogo - should return null', async () => {
        const testLogo = null;

        mockPoolQuery.mockResolvedValueOnce({rows: [{encode: testLogo}]});
        const res = await selectLogo();

        expect(res).toEqual(null);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT encode(image, \'base64\') FROM logo WHERE id = $1', [1]);
    });

    it('selectLogo - should correctly return the logo', async () => {
        const testLogo = "V2UncmUgbm8gc3RyYW5nZXJzIHRvIGxvdmUKWW91IGtub3cgdGhlIHJ1bGVzIGFuZCBzbyBkbyBJCkEgZnVsbCBjb21taXRtZW50J3Mgd2hhdCBJJ20gdGhpbmtpbmcgb2YKWW91IHdvdWxkbid0IGdldCB0aGlzIGZyb20gYW55IG90aGVyIGd1eQpJIGp1c3Qgd2FubmEgdGVsbCB5b3UgaG93IEknbSBmZWVsaW5nCkdvdHRhIG1ha2UgeW91IHVuZGVyc3RhbmQKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91CldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkFuZCBpZiB5b3UgYXNrIG1lIGhvdyBJJ20gZmVlbGluZwpEb24ndCB0ZWxsIG1lIHlvdSdyZSB0b28gYmxpbmQgdG8gc2VlCk5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQpOZXZlciBnb25uYSB0ZWxsIGEgbGllIGFuZCBodXJ0IHlvdQpOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSwgbmV2ZXIgZ29ubmEgZ2l2ZQooR2l2ZSB5b3UgdXApCldlJ3ZlIGtub3duIGVhY2ggb3RoZXIgZm9yIHNvIGxvbmcKWW91ciBoZWFydCdzIGJlZW4gYWNoaW5nIGJ1dCB5b3UncmUgdG9vIHNoeSB0byBzYXkgaXQKSW5zaWRlIHdlIGJvdGgga25vdyB3aGF0J3MgYmVlbiBnb2luZyBvbgpXZSBrbm93IHRoZSBnYW1lIGFuZCB3ZSdyZSBnb25uYSBwbGF5IGl0CkkganVzdCB3YW5uYSB0ZWxsIHlvdSBob3cgSSdtIGZlZWxpbmcKR290dGEgbWFrZSB5b3UgdW5kZXJzdGFuZApOZXZlciBnb25uYSBnaXZlIHlvdSB1cApOZXZlciBnb25uYSBsZXQgeW91IGRvd24KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQpOZXZlciBnb25uYSBtYWtlIHlvdSBjcnkKTmV2ZXIgZ29ubmEgc2F5IGdvb2RieWUKTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3UKTmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91Ck5ldmVyIGdvbm5hIGdpdmUgeW91IHVwCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bgpOZXZlciBnb25uYSBydW4gYXJvdW5kIGFuZCBkZXNlcnQgeW91Ck5ldmVyIGdvbm5hIG1ha2UgeW91IGNyeQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQ==";

        mockPoolQuery.mockResolvedValueOnce({rows: [{encode: testLogo}]});

        const res = await selectLogo();
        expect(res).toEqual(`data:image/png;base64,${testLogo}`);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT encode(image, \'base64\') FROM logo WHERE id = $1', [1]);
    });

    it('selectLogo - should throw an error when there is a problem with retrieving a Logo', async () => {

        mockPoolQuery.mockRejectedValue(new Error("Error retrieving Logo"));

        let error;
        try {
            await selectLogo();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});