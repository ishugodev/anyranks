<template>
  <div class="sort-container">
    <div v-if="!finished" class="sort">
      <strong>Sorting Time!⚡</strong>
      <p>Which one do you prefer?</p>

      <div v-if="pair">
        <div class="controls">
          <div class="choices">
            <button class="choice" @click="choose(pair[0])">
              {{ pair[0].text }}
            </button>
            <span>VS</span>
            <button class="choice" @click="choose(pair[1])">
              {{ pair[1].text }}
            </button>
          </div>

          <div class="extra-actions">
            <button class="choice" @click="likeBoth">I like both!</button>
            <button class="choice" @click="goBack">Go back</button>
          </div>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercent + '%' }"></div>
        <p>{{ currentIndex + 1 }} / {{ totalComparisons }} done</p>
      </div>
    </div>

    <div v-else class="result">
      <strong class="result-title">Ranking🏆</strong>
      <ul class="podium">
        <li
          v-for="(item, index) in rankedCompetitiveTies.slice(0, 3)"
          :key="index"
          class="podium-item"
          :class="'pos-' + item.rank"
        >
          <img
            class="podium-image"
            :src="item?.image || placeholder"
            alt="item image"
          />
          <div class="podium-content">
            <div class="podium-content-row-1">
              <div class="podium-rank">{{ item.rank }}º</div>
              <div class="podium-text">{{ item.text }}</div>
            </div>
            <div class="podium-score">{{ item.score }} pts</div>
          </div>
        </li>
      </ul>

      <ul class="ranking-list">
        <li
          v-for="(item, index) in rankedCompetitiveTies.slice(3)"
          :key="index"
          class="rank-card"
        >
          <img class="rank-card-image" :src="item?.image || placeholder" />
          <div class="rank-card-content">
            <div class="rank-card-content-row-1">
              <div class="rank-number">{{ item.rank }}º</div>
              <div class="rank-text">{{ item.text }}</div>
            </div>
            <div class="rank-score">{{ item.score }} pts</div>
          </div>
        </li>
      </ul>

      <div class="button-wrapper">
        <div class="share-stuff">
          <button class="button-outline" disabled>
            <span>Share</span>
            <Icon class="icon" name="mingcute:share-2-fill" />
          </button>
          <button class="button-outline" @click="saveResultImage">
            <span>Save result image</span>
            <Icon class="icon" name="mingcute:save-2-line" />
          </button>
        </div>
        <div class="navigation">
          <button class="button-restart" @click="restart">Restart</button>
          <button class="button-home" @click="goHome">Make another!</button>
        </div>
      </div>
    </div>
    <!-- invisible wrapper to export -->
    <div class="export-wrapper">
      <div id="export-area" class="export-area">
        <strong class="result-title">Ranking🏆</strong>

        <ul class="podium">
          <li
            v-for="(item, index) in rankedCompetitiveTies.slice(0, 3)"
            :key="index"
            class="podium-item"
            :class="'pos-' + item.rank"
          >
            <img class="podium-image" :src="item?.image || placeholder" />
            <div class="podium-content">
              <div class="podium-content-row-1">
                <div class="podium-rank">{{ item.rank }}º</div>
                <div class="podium-text">{{ item.text }}</div>
              </div>
              <div class="podium-score">{{ item.score }} pts</div>
            </div>
          </li>
        </ul>

        <ul class="ranking-list">
          <li
            v-for="(item, index) in rankedCompetitiveTies.slice(3)"
            :key="index"
            class="rank-card"
          >
            <img class="rank-card-image" :src="item?.image || placeholder" />
            <div class="rank-card-content">
              <div class="rank-card-content-row-1">
                <div class="rank-number">{{ item.rank }}º</div>
                <div class="rank-text">{{ item.text }}</div>
              </div>
              <div class="rank-score">{{ item.score }} pts</div>
            </div>
          </li>
        </ul>
      </div>
      <!-- -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import placeholder from "/imgs/placeholder.jpg";
import { useRouter } from "vue-router";

const router = useRouter();

interface RankItem {
  text: string;
  score: number;
  image?: string;
}

interface StoredData {
  temp_items: { text: string }[];
  result?: { rank: number; text: string; score: number; image?: string }[];
}

const items = ref<RankItem[]>([]);
const currentIndex = ref(0);
const comparisons = ref<[RankItem, RankItem][]>([]);
const history = ref<number[]>([]);
const finished = ref(false);

const totalComparisons = computed(() => comparisons.value.length);
const progressPercent = computed(() =>
  totalComparisons.value
    ? ((currentIndex.value / totalComparisons.value) * 100).toFixed(1)
    : 0
);
const pair = computed<[RankItem, RankItem] | undefined>(
  () => comparisons.value[currentIndex.value]
);
const canGoBack = computed(() => history.value.length > 0);

const rankedCompetitiveTies = computed(() => {
  const sorted = [...items.value].sort((a, b) => b.score - a.score);
  const result: {
    rank: number;
    text: string;
    score: number;
    image?: string;
  }[] = [];

  let currentRank = 1;
  let prevScore: number | null = null;
  let itemsProcessed = 0;

  for (const current of sorted) {
    itemsProcessed++;

    if (prevScore !== null && current.score < prevScore) {
      currentRank = itemsProcessed;
    }

    result.push({
      rank: currentRank,
      text: current.text,
      score: current.score,
    });

    prevScore = current.score;
  }

  return result;
});

onMounted(() => {
  try {
    const stored = localStorage.getItem("@anyranks");
    if (!stored) return router.push("/");

    const data: StoredData = JSON.parse(stored);
    if (!data.temp_items || !data.temp_items.length) return router.push("/");

    items.value = data.temp_items.map((index) => ({
      text: index.text,
      score: 0,
    }));

    comparisons.value = generateComparisons(items.value);
  } catch (error) {
    console.error("error: ", error);
    router.push("/");
  }
});

function generateComparisons(arr: RankItem[]) {
  const pairs: [RankItem, RankItem][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i]!, arr[j]!]);
    }
  }
  return pairs;
}

function choose(selected: RankItem) {
  const pair = comparisons.value[currentIndex.value];
  if (!pair) return;
  // const [a, b] = pair;
  selected.score += 1;
  history.value.push(currentIndex.value);
  nextComparison();
}

function likeBoth() {
  const pair = comparisons.value[currentIndex.value];
  if (!pair) return;
  const [a, b] = pair;
  a.score += 1;
  b.score += 1;
  history.value.push(currentIndex.value);
  nextComparison();
}

function goBack() {
  if (!canGoBack.value) return;
  const lastIndex = history.value.pop()!;
  currentIndex.value = lastIndex;
}

function nextComparison() {
  currentIndex.value++;
  if (currentIndex.value >= comparisons.value.length) {
    finishRanking();
  }
}

function finishRanking() {
  finished.value = true;
  const data = JSON.parse(localStorage.getItem("@anyranks") || "{}");
  data.result = rankedCompetitiveTies.value;
  localStorage.setItem("@anyranks", JSON.stringify(data));
}

function goHome() {
  router.push("/");
}

function restart() {
  items.value.forEach((item) => (item.score = 0));

  comparisons.value = generateComparisons(items.value);

  currentIndex.value = 0;
  history.value = [];
  finished.value = false;

  const data = JSON.parse(localStorage.getItem("@anyranks") || "{}");
  if (data.temp_items) {
    data.result = null;
    localStorage.setItem("@anyranks", JSON.stringify(data));
  }
}

async function saveResultImage() {
  try {
    const area = document.getElementById("export-area");
    if (!area) return;

    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(area, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const dataUrl = canvas.toDataURL("image/png");

    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    const fileName = `ranking_${yyyy}${mm}${dd}_${hh}${mi}${ss}.png`;

    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Erro ao salvar imagem:", err);
  }
}

defineExpose({
  items,
  currentIndex,
  comparisons,
  history,
  finished,
  placeholder,
  choose,
  likeBoth,
  goBack,
  finishRanking,
  restart,
});
</script>
