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
      <input
        ref="inputRef"
        v-model="newItem"
        data-test="input-main"
        class="input-main"
        type="text"
        placeholder="Add item"
        @keyup.enter="addItem"
      />
      <button
        data-test="add-item-button"
        class="add-item-button"
        aria-label="Add item"
        @click="addItem"
      >
        <Icon name="mingcute:add-line" />
      </button>
    </div>

    <p class="div-align-center">Sort list</p>
    <ul v-if="items.length > 0">
      <li
        v-for="(item, index) in items.length ? items : placeholderList"
        :key="index"
      >
        <span>{{ item.text || "\u00A0" }}</span>
        <button
          data-test="remove-item-button"
          class="danger remove-item-button"
          aria-label="Remove item"
          @click="removeItem(index)"
        >
          <Icon name="mingcute:close-line" />
        </button>
      </li>
    </ul>

    <p v-else class="div-align-center">No list yet!😪</p>

    <div class="div-align-center">
      <button v-if="canSort" class="sort-button" @click="startSort">
        Start sorting!🤩
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useRouter } from "vue-router";

const router = useRouter();

const newItem = ref("");
const items = ref<{ text: string }[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);
const showErrorInputNull = ref(false);
const showErrorSameNameItems = ref(false);
const canSort = ref(false);

const placeholderList = Array(5).fill(null);

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
