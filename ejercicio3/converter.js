class Currency {
	constructor(code, name) {
		this.code = code;
		this.name = name;
	}
}

class CurrencyConverter {
	constructor(apiUrl) {
		this.apiUrl = apiUrl;
		this.currencies = [];
	}

	async getCurrencies() {
		try {
			const response = await fetch(`${this.apiUrl}/currencies`);
			const data = await response.json();
			for (const code in data) {
				this.currencies.push(new Currency(code, data[code]));
			}
		} catch (error) {
			console.error("Error al obtener las monedas:", error);
		}
	}

	async convertCurrency(amount, fromCurrency, toCurrency) {
		if (fromCurrency.code === toCurrency.code) {
			return amount;
		}

		try {
			const response = await fetch(`${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
			const data = await response.json();
			return data.rates[toCurrency.code] * amount;
		} catch (error) {
			console.error("Error al convertir la moneda:", error);
			return null;
		}
	}

}

document.addEventListener("DOMContentLoaded", async () => {
	const form = document.getElementById("conversion-form");
	const resultDiv = document.getElementById("result");
	const fromCurrencySelect = document.getElementById("from-currency");
	const toCurrencySelect = document.getElementById("to-currency");
	const exchangeRate2024_07_05 = document.getElementById("exchange-rate-2024-07-05");
	const exchangeRate2024_07_04 = document.getElementById("exchange-rate-2024-07-04");
	const exchangeRateDifference = document.getElementById("exchange-rate-difference");

	const converter = new CurrencyConverter("https://api.frankfurter.app");

	await converter.getCurrencies();
	populateCurrencies(fromCurrencySelect, converter.currencies);
	populateCurrencies(toCurrencySelect, converter.currencies);

	let data2024_07_05, data2024_07_04;

	try {
		const response2024_07_05 = await fetch("https://api.frankfurter.app/2024-07-05");
		data2024_07_05 = await response2024_07_05.json();
		exchangeRate2024_07_05.textContent = `Tasa de cambio para 2024-07-05: ${JSON.stringify(data2024_07_05.rates)}`;
	} catch (error) {
		console.error("Error al obtener la tasa de cambio para 2024-07-05:", error);
	}

	try {
		const response2024_07_04 = await fetch("https://api.frankfurter.app/2024-07-04");
		data2024_07_04 = await response2024_07_04.json();
		exchangeRate2024_07_04.textContent = `Tasa de cambio para 2024-07-04: ${JSON.stringify(data2024_07_04.rates)}`;
	} catch (error) {
		console.error("Error al obtener la tasa de cambio para 2024-07-04:", error);
	}

	if (data2024_07_05 && data2024_07_04) {
		for (const code in data2024_07_05.rates) {
			const rateDay5 = data2024_07_05.rates[code];
			const rateDay4 = data2024_07_04.rates[code];
			const difference = rateDay5 - rateDay4;

			const codeElement = document.createElement("div");
			codeElement.textContent = `Diferencia para ${code}: ${difference.toFixed(4)}`;
			exchangeRateDifference.appendChild(codeElement);
		}
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const amount = document.getElementById("amount").value;
		const fromCurrency = converter.currencies.find(
			(currency) => currency.code === fromCurrencySelect.value
		);
		const toCurrency = converter.currencies.find(
			(currency) => currency.code === toCurrencySelect.value
		);

		if (fromCurrency.code === toCurrency.code) {
			resultDiv.textContent = `El monto ingresado es: ${amount} ${fromCurrency.code}`;
		} else {
			const convertedAmount = await converter.convertCurrency(
				amount,
				fromCurrency,
				toCurrency
			);

			if (convertedAmount !== null) {
				if (!isNaN(convertedAmount)) {
					resultDiv.textContent = `${amount} ${fromCurrency.code} son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
				} else {
					resultDiv.textContent = "La conversión no devolvió un valor numérico.";
				}
			} else {
				resultDiv.textContent = "Error al realizar la conversión.";
			}
		}
	});

	function populateCurrencies(selectElement, currencies) {
		if (currencies) {
			currencies.forEach((currency) => {
				const option = document.createElement("option");
				option.value = currency.code;
				option.textContent = `${currency.code} - ${currency.name}`;
				selectElement.appendChild(option);
			});
		}
	}
});
