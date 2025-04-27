<template>
  <div class="container">
    <section class="hero">
      <div class="hero-content container">
        <h2>{{ $t('pages.index.heroTitle') }}</h2>
        <p>{{ $t('pages.index.heroDescription') }}</p>
        <a href="https://app.sanovise.ranzak.site/" class="btn-primary">{{ $t('pages.index.getStarted') }}</a>
      </div>
    </section>

    <section class="content-container container">
      <div class="news-container">
        <div class="news-item" v-for="item in newsArticles" :key="item.title" @click="openArticle(item.url)">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>

      <div class="features-container">
        <div class="feature-card" v-for="item in features" :key="item.title">
          <h3>{{ $rt(item.title) }}</h3>
          <p>{{ $rt(item.description) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const features = useI18n().tm('pages.index.features') as any[];
const newsArticles = ref<any[]>([]);

const fetchNews = async () => {
  const apiKey = '665b04e4317e42a69d12d5a7b993fcdb';
  const url = `https://newsapi.org/v2/everything?q=health&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'ok') {
      newsArticles.value = data.articles.slice(0, 4);
    } else {
      console.error('Failed to fetch news');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

const openArticle = (url: string) => {
  window.open(url, '_blank');
};

onMounted(() => {
  fetchNews();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/index.scss';
</style>