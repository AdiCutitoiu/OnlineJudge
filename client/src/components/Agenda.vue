<template>
  <v-container>
      <div class="calendar-component">
			<kalendar :configuration="calendar_settings" :appointments="appointments" class="generate-shadow">
				<div slot="creating-card" slot-scope="{appointment_props}">
					<h4 class="appointment-title" style="text-align: left;">New Appointment</h4>
					<span class="time">{{getHours(appointment_props.start_value.value, appointment_props.end_value.value)}}
					</span>
				</div>
				<div slot="popup-form" slot-scope="{popup_scope}" style="display: flex; flex-direction: column;">
					<h4 style="margin-bottom: 10px">New Appointment</h4>
					<input v-model="new_appointment['title']" type="text" name="title" placeholder="Title">
					<textarea v-model="new_appointment['description']" type="text" name="description" placeholder="Description" rows="2"></textarea>
					<div class="buttons">
						<button class="cancel" @click="popup_scope.close_popup = true">Cancel</button>
						<button @click="completeAppointment(popup_scope, new_appointment)">Save</button>
					</div>
				</div>
				<div slot="details-card" slot-scope="{appointment_props}" class="details-card">
					<h4 class="appointment-title">{{appointment_props.data.title}}</h4>
					<small v-show="(appointment_props.end - appointment_props.start) > 2">{{appointment_props.data.description}}</small>
					<span class="time">{{appointment_props.start_value.value | normalizeDate('hh:mm A')}} - {{appointment_props.end_value.value | normalizeDate('hh:mm A')}}</span>
					<button @click="removeAppointment(appointment_props)" class="cancel">
						<svg class="feather feather-x-circle sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1326"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
					</button>
				</div>
				<template slot="first-date" slot-scope="{ date }">
					{{ date | normalizeDate('MMM DD') }}
				</template>
				<template slot="last-date" slot-scope="{ date }">
					{{ date | normalizeDate('DD MMM, YYYY') }}
				</template>
				<template slot="current-date" slot-scope="{ date }">
					{{ date | normalizeDate('DD MMM, YYYY') }}
				</template>
				<template slot="number-date" slot-scope="{ date }">
					{{ date | normalizeDate('D') }}
				</template>
				<template slot="letters-date" slot-scope="{ date }">
					{{ date | normalizeDate('ddd') }}
				</template>
			</kalendar>
		</div>
  </v-container>

</template>

<script>

import Vue from 'vue';
import VueHighlightJS from 'vue-highlightjs'
Vue.use(VueHighlightJS)
import format from 'date-fns/format';
import { Kalendar } from 'kalendar-vue';
import 'kalendar-vue/dist/KalendarVue.css';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
locale.use(lang);

let new_appointment_model = {
	description: null,
	title: null,
};
let manual_appointment_model = { ...new_appointment_model,
	from: null,
	to: null,
	date: null,
};

export default {
  name: "Agenda",
  components: {
		Kalendar,
	},
	data: () => ({
		appointments: [],
		calendar_settings: {
			style: 'material_design',
			view_type: 'Month',
			split_value: 20,
			cell_height: 20,
			scrollToNow: false,
			current_day: new Date(),
			military_time: false,
			read_only: false
		},
		outline_slots: false,
		new_appointment: JSON.parse(JSON.stringify(new_appointment_model)),
		manual_form: JSON.parse(JSON.stringify(manual_appointment_model)),
		adding_manually: false,
	}),
  methods: {getHours(start, end) {
			return `${format(start, 'hh:mm A')} - ${format(end, 'hh:mm A')}`;
		},
		completeAppointment(popup_data, form_data) {
			let payload = {
				data: {
					title: form_data.title,
					description: form_data.description,
				},
				from: popup_data.appointment_props.start_value.value,
				to: popup_data.appointment_props.end_value.value,
				date: format(popup_data.appointment_props.start_value.value, 'YYYY-MM-DD'),
			};
			this.appointments.push(payload);
			this.new_appointment = JSON.parse(JSON.stringify(new_appointment_model));
			popup_data.close_popup = true;
		},
		addManually() {
			let { title, description, from, to, date } = this.manual_form;
			from = `${date}T${from}:00`;
			to = `${date}T${to}:00`;
			let payload = {
				data: { title, description },
				from,
				to,
				date: format(from, 'YYYY-MM-DD'),
			};
			this.appointments.push(payload);
			this.manual_form = JSON.parse(JSON.stringify(manual_appointment_model));
			this.adding_manually = false;
		},
		removeAppointment(appointment) {
			let index = this.appointments.findIndex(item => item.from === appointment.start_value.value);
			this.appointments.splice(index, 1);
		},
  }
};
</script>
<style>
body {
  margin: 0px;
}
body * {
  box-sizing: border-box;
}

.calendar-component {
  position: relative;
  z-index: 1;
}
.calendar-component .details-card {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100%;
}
.calendar-component .details-card button {
  margin: 0;
  border: none;
  background-color: transparent;
  color: #F61067;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
.calendar-component .details-card button svg {
  width: 18px;
  height: 18px;
}

.event-popup {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.event-popup .buttons {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.event-popup .buttons button {
  border: none;
  color: #29771c;
  background-color: rgba(0, 240, 181, 0.04);
  padding: 5px 10px;
}
.event-popup .buttons button.cancel {
  background-color: rgba(246, 16, 103, 0.04);
  color: #F61067;
}

.add-manual {
  border: none;
  background-color: #007FFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  z-index: 2;
}
.add-manual svg {
  stroke: white;
}

.manual-add {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.7);
}
.manual-add > form {
  max-width: 540px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  position: relative;
}
.manual-add label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 10px;
  border-bottom: solid 1px whitesmoke;
  padding-bottom: 10px;
}
.manual-add .info {
  font-size: 12px;
  color: grey;
}
.manual-add button.save {
  border: none;
  margin-top: 15px;
  padding: 10px;
  background-color: blue;
  color: white;
  font-size: 16px;
  border-radius: 8px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
.manual-add button.close {
  border: none;
  outline: none;
  transform: rotate(45deg);
  background: transparent;
  position: absolute;
  top: -25px;
  right: -25px;
}
.manual-add button.close svg {
  stroke: white;
}
.manual-add .el-input,
.manual-add textarea {
  font-size: 14px;
  min-width: 160px;
  max-width: 200px;
  margin-left: auto;
}

.show-slots .vue-portal-target {
  outline: dashed 1px red;
  outline-offset: -1px;
}
</style>

