<template>
  <div class="sort-container">
    <div v-if="pair" class="sort">
      <strong>Sorting Time!⚡</strong>
      <p>Which one do you prefer?</p>

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

      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercent + '%' }"></div>
        <p>{{ currentIndex + 1 }} / {{ totalComparisons }} done</p>
      </div>
    </div>

    <div v-else class="result">
      <strong>Ranking🏆</strong>
      <ul>
        <li v-for="(item, index) in rankedCompetitiveTies" :key="index">
          <span class="index">{{ item.rank }}º</span>
          <span class="item">{{ item.text }} ({{ item.score }} pt.)</span>
        </li>
      </ul>

      <div class="button-wrapper">
        <button @click="restart">Restart!🔄️</button>
        <button @click="goHome">Make another!🏃‍➡️</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { useRouter } from "vue-router";

const router = useRouter();

interface RankItem {
  text: string;
  score: number;
}

interface StoredData {
  temp_items: { text: string }[];
  result?: { rank: number; text: string; score: number }[];
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
  const result: { rank: number; text: string; score: number }[] = [];

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
</script>
