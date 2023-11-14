import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SteamApiService {

    constructor(private web3: Web3Service) { }

    async AddOrChangeApiKey(key: string): Promise<any> {
        const hashedKey = this.web3.shaMessage(key);
        const now = new Date().toLocaleString("en-GB", { timeZone: "CET" });
        const message = `Sign to authenticate. Sign: ${hashedKey}. Timestamp: ${now}`;
        const address = this.web3.webUser.address;

        return this.web3.signMessage(message).then(async (signature) => {
            const response = await fetch(`${environment.steamApi}/auth/sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ signature, address, message, apiKey: key }),
            });
            if (!response.ok) {
                console.error('Failed to authenticate:', response.statusText);
                return;
            }
            const responseBody = await response.json();  // Parse the response body as JSON
            console.log('responseBody', responseBody);
            const accessToken = responseBody.access_token;  // Extract the access_token from the response body
            console.log('access_token', accessToken);

            const endCallResponse = await fetch(`${environment.steamApi}/user-api/ChangeOrAddApiKey`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const endCallResponseBody = await endCallResponse.json();

            return endCallResponseBody;

            if (endCallResponseBody.error) {
                console.log('endCallResponseBody.error', endCallResponseBody.error);
            }

            if (endCallResponseBody.saved) {
                console.log('endCallResponseBody.saved', endCallResponseBody.saved);
                return true;
            }

        }).catch((err) => {
            console.log(err);
            return err;
        });
    }

    async isAddressRegistered(address: string): Promise<any> {
        const endCallResponse = await fetch(`${environment.steamApi}/user-api/isAddressRegistered`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        });
        return await endCallResponse.json();
    }
}