<template>
  <div class="overflow-auto min-w-0">
    <table class="table table-xs table-pin-rows table-pin-cols ">
      <thead>
        <tr>
          <th />
          <template v-for="seat in props.seats.seatsPerRow" :key="seat">
            <td class="text-center">{{ seat }}</td>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in props.seats.rows" :key="row">
          <tr>
            <th class="text-center whitespace-nowrap">Ряд {{ index + 1 }}</th>
            <template v-for="seat in props.seats.seatsPerRow" :key="seat">
              <td class="text-center">
                <button
                  class="btn btn-square"
                  :class="getSeatColor(row, seat)"
                  @click="handleSeatClick(row, seat)"
                />
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

</template>

<script setup lang="ts">
import type { Seat } from "~/client";

interface TableSeats {
  rows: number;
  seatsPerRow: number;
}

interface TableProps {
  seats: TableSeats;
  bookedSeats: Seat[];
}

const props = defineProps<TableProps>();

const emit = defineEmits<{
  (e: "selected-seats", seats: Seat[]): void;
}>();

const selectedSeats = ref<Seat[]>([]);

const getSeatColor = (rowNumber: number, seatNumber: number): string => {
  if (isSeatSelected(rowNumber, seatNumber)) {
    return "btn-success";
  } else if (isSeatBooked(rowNumber, seatNumber)) {
    return "btn-error";
  } else return "";
};
const handleSeatClick = (rowNumber: number, seatNumber: number): void => {
  if (isSeatBooked(rowNumber, seatNumber)) return
  if (isSeatSelected(rowNumber, seatNumber)) {
    selectedSeats.value = selectedSeats.value.filter(
      (seat) =>
        !(seat.rowNumber === rowNumber && seat.seatNumber === seatNumber)
    );
  } else {
    selectedSeats.value.push({ rowNumber, seatNumber });
  }
  emit("selected-seats", selectedSeats.value);
};

const isSeatSelected = (rowNumber: number, seatNumber: number): boolean => {
  return selectedSeats.value.some(
    (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
  );
};
const isSeatBooked = (rowNumber: number, seatNumber: number): boolean => {
  return props.bookedSeats.some(
    (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
  );
};
</script>
