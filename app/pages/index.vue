<template>
  <div class="home-container">
    <h1>AnyRanks</h1>
    <h2>
      Type a character or something you want to add to make the rank list!😎
    </h2>
    <p>Press Enter or + button to add to list!👍</p>

    <div class="alert-messages">
      <!-- acho q é melhor ter só um tag e mudar mensagem no script -->
      <span v-if="showErrorInputNull">Nothing to add! Please type.</span>
      <span v-if="showErrorSameNameItems">
        Same name! Please add different name.
      </span>
    </div>

    <form class="" @submit.prevent="addItem">
      <div v-if="withImage" class="form-uploader-wrapper">
        <img :src="formItemImgSrc ? formItemImgSrc : ' '" :class="formItemImgSrc && 'withFormItemImgSrc'" />
        <input ref="inputFileRef" type="file" @change="showImagePreview" />
        <Icon class="icon-uploader" :class="formItemImgSrc && 'withFormItemImgSrc'" name="mingcute:file-upload-fill" />
      </div>
      <div class="input-wrapper">
        <input
          ref="inputRef"
          v-model="newItem"
          data-test="input-main"
          class="input-main"
          type="text"
          placeholder="Add item"
        />
        <button
          data-test="add-item-button"
          class="add-item-button"
          aria-label="Add item"
          type="submit"
        >
          <Icon name="mingcute:add-line" />
        </button>
      </div>
    </form>

    <div>
      <input id="withImage" ref="withImageRef" type="checkbox" checked @change="toggleWithImage" />
      <label for="withImage">Items with image</label>
    </div>

    <p class="div-align-center">Sort list</p>
    <ul v-if="items.length > 0">
      <li
        v-for="(item, index) in items.length ? items : placeholderList"
        :key="index"
      >
        <div v-if="withImage" class="item-image-wrapper">
          <img v-if="withImage" :src="item.image" :alt="item.title"/>
          <input
              v-if="withImage"
              type="file"
              @change="changeItemImage(index, $event)"
            />
        </div>
        <span contenteditable="true" @keydown.enter.prevent="finishEdit" @blur="changeItemTitle(index, $event)">{{ item.title }}</span>
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
const items = ref<{ title: string, image?: string }[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);
const showErrorInputNull = ref(false);
const showErrorSameNameItems = ref(false);
const canSort = ref(false);
const withImageRef = ref<HTMLInputElement | null>(null);
const withImage = ref(true);

const placeholderList = Array(5).fill(null);

const formItemImgSrc = ref('');
const inputFileRef = ref<HTMLInputElement | null>(null);

onMounted(async () => {
  withImage.value = withImageRef.value ? withImageRef.value.checked : true;
  const stored = localStorage.getItem("@anyranks");
  if (stored) {
    const data = JSON.parse(stored);
    data.temp_items = [];
    localStorage.setItem("@anyranks", JSON.stringify(data));
  } else {
    localStorage.setItem("@anyranks", JSON.stringify({ temp_items: [] }));
  }
});

const toggleWithImage = () => {
  withImage.value = !withImage.value
}

const showImagePreview = (e: Event) => {
  const input = e.target as HTMLInputElement;

  if (!input.files || !input.files[0]) return;

  formItemImgSrc.value = URL.createObjectURL(input.files[0]);
}

function addItem() {
  showErrorInputNull.value = false;
  showErrorSameNameItems.value = false;

  if (!newItem.value) {
    showErrorInputNull.value = true;
    return;
  }

  if (items.value.find((item) => item.title === newItem.value)) {
    showErrorSameNameItems.value = true;
    return;
  }

  items.value.push({ title: newItem.value, image: formItemImgSrc.value || '/imgs/placeholder.jpg' });
  
  newItem.value = "";
  formItemImgSrc.value = "";

  if (inputFileRef.value) {
    inputFileRef.value.value = '';
  }

  inputRef.value?.focus();

  canSort.value = items.value.length > 1;
  return;
}

function removeItem(index: number) {
  items.value.splice(index, 1);
  canSort.value = items.value.length > 1;
}

function changeItemTitle(index: number, e: Event) {
  const item = e.target as HTMLSpanElement;

  items.value[index] = {
    ...items.value[index],
    title: item.textContent,
  };
}

function finishEdit(e: KeyboardEvent) {
  (e.target as HTMLElement).blur();
}

function changeItemImage(index: number, e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const item = items.value[index];
  if (!item) return;

  const imageSrc = URL.createObjectURL(input.files[0]);

  items.value[index] = {
    ...item,
    image: imageSrc,
  };
}

function startSort() {
  const data = {
    temp_items: items.value,
    withImage: withImage.value
  };

  localStorage.setItem("@anyranks", JSON.stringify(data));
  router.push("/sort");
}
</script>
