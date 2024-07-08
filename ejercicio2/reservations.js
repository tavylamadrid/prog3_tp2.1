class Customer {
	constructor(id, name, email) {
		this.id = id;
		this.name = name;
		this.email = email;
	}

	get info() {
		return `${this.name} - ${this.email}`;
	}
}

class Reservation {
	constructor(id, customer, date, guests) {
		this.id = id;
		this.customer = customer;
		this.date = new Date(date);
		this.guests = guests;
	}

	get info() {
		return `Fecha y hora: ${this.date.toLocaleString()}, Cliente: ${this.customer.info}, Número de comensales: ${this.guests}`;
	}

	static validateReservation(reservationInfo) {
		const { date, guests } = reservationInfo;
		const currentDate = new Date();

		if (new Date(date) < currentDate) {
			console.log("Fecha no válida: La fecha de la reserva es anterior a la fecha actual.");
			return false;
		}

		if (guests <= 0) {
			console.log("Comensales no válidos: La cantidad de comensales debe ser mayor a 0.");
			return false;
		}

		return true;
	}
}

class Restaurant {
	constructor(name) {
		this.name = name;
		this.reservations = [];
	}

	addReservation(reservation) {
		this.reservations.push(reservation);
	}

	render() {
		const container = document.getElementById("reservations-list");
		container.innerHTML = "";
		this.reservations.forEach((reservation) => {
			const reservationCard = document.createElement("div");
			reservationCard.className = "box";
			reservationCard.innerHTML = `
					<p class="subtitle has-text-primary">
						Reserva ${
							reservation.id
						} - ${reservation.date.toLocaleString()}
					</p>
					<div class="card-content">
						<div class="content">
							<p>
								${reservation.info}
							</p>
						</div>
					</div>
			  `;
			container.appendChild(reservationCard);
		});
	}
}

document.getElementById("reservation-form").addEventListener("submit", function (event) {
	event.preventDefault();

	const customerName = document.getElementById("customer-name").value;
	const customerEmail = document.getElementById("customer-email").value;
	const reservationDate = document.getElementById("reservation-date").value;
	const guests = parseInt(document.getElementById("guests").value);

	const reservationInfo = { date: reservationDate, guests: guests };

	const errorContainer = document.getElementById("error-message");

	if (!Reservation.validateReservation(reservationInfo)) {
		errorContainer.textContent = "No es posible realizar la reserva con los datos ingresados.";
	} else {
		const customerId = restaurant.reservations.length + 1;
		const reservationId = restaurant.reservations.length + 1;

		const customer = new Customer(customerId, customerName, customerEmail);
		const reservation = new Reservation(reservationId, customer, reservationDate, guests);

		restaurant.addReservation(reservation);
		restaurant.render();

		errorContainer.textContent = "Reserva realizada con éxito.";
	}
});

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
	restaurant.addReservation(reservation1);
	restaurant.render();
} else {
	alert("Datos de reserva inválidos");
}

