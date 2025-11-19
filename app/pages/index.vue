<template>
  <div class="home-container">
    <h1>AnyRanks</h1>
    <h2>
      Type a character or something you want to add to make the rank list!😎
    </h2>
    <p>Press Enter or + button to add to list!👍</p>

    <div class="alert-messages">
      <span v-if="showErrorInputNull">Nothing to add! Please type.</span>
      <span v-if="showErrorSameNameItems">
        Same name! Please add different name.
      </span>
    </div>

    <div class="input-wrapper">
      <el-input
        ref="inputRef"
        v-model="newItem"
        data-test="input-main"
        type="text"
        placeholder="Add item"
        @keyup.enter="addItem"
      />
      <el-button data-test="add-item-button" :icon="Plus" @click="addItem" />
    </div>

    <p class="div-align-center">Sort list</p>
    <ul v-if="items.length > 0">
      <li v-for="(item, index) in items" :key="index">
        <span>{{ item.text }}</span>
        <el-button
          data-test="remove-item-button"
          class="danger"
          :icon="Close"
          circle
          @click="removeItem(index)"
        />
      </li>
    </ul>

    <p v-else class="div-align-center">No list yet!😪</p>

    <div class="div-align-center">
      <el-button v-if="canSort" class="sort-button" @click="startSort"
        >Start sort!🤩</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import { Plus, Close } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const newItem = ref("");
const items = ref<{ text: string }[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);
const showErrorInputNull = ref(false);
const showErrorSameNameItems = ref(false);
const canSort = ref(false);

onMounted(() => {
  const stored = localStorage.getItem("@anyranks");
  if (stored) {
    const data = JSON.parse(stored);
    data.temp_items = [];
    localStorage.setItem("@anyranks", JSON.stringify(data));
  } else {
    localStorage.setItem("@anyranks", JSON.stringify({ temp_items: [] }));
  }
});

function addItem() {
  showErrorInputNull.value = false;
  showErrorSameNameItems.value = false;

  if (!newItem.value) {
    showErrorInputNull.value = true;
    inputRef.value?.focus();
    return;
  }

  if (items.value.find((item) => item.text === newItem.value)) {
    showErrorSameNameItems.value = true;
    return;
  }

  items.value.push({ text: newItem.value });
  newItem.value = "";
  inputRef.value?.focus();

  canSort.value = items.value.length > 1;
}

function removeItem(index: number) {
  items.value.splice(index, 1);
  canSort.value = items.value.length > 1;
}

function startSort() {
  const data = {
    temp_items: items.value,
  };

  localStorage.setItem("@anyranks", JSON.stringify(data));
  router.push("/sort");
}
</script>
