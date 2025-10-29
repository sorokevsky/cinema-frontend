<template>
  <div class="flex flex-col gap-3">
    <template v-if="loading">
      <div class="mx-auto my-30">
        <span class="loading loading-dots loading-xl" />
      </div>
    </template>
    <template v-else>
      <h1 class="p-3 text-3xl font-medium text-center">Мои билеты</h1>

      <div class="divider divider-start">Не оплаченные</div>

      <table class="table">
        <tbody>
          <tr>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          <tr>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          <tr>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>

      <div class="divider divider-start">Будущие</div>

      <table class="table">
        <!-- head -->
        <tbody>
          <!-- row 1 -->
          <tr>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          <!-- row 3 -->
          <tr>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>

      <div class="divider divider-start">Прошедшие</div>

      <table class="table">
        <!-- head -->
        <tbody>
          <!-- row 1 -->
          <tr>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          <!-- row 3 -->
          <tr>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getMeBookings, type Booking } from "~/client";

definePageMeta({
  middleware: ['auth'],
})

const bookings = ref<Booking[]>();
const loading = ref<boolean>(true);

onMounted(async () => {
  bookings.value = await getMeBookings({});
  loading.value = false;
  console.log(bookings.value);
});
</script>
