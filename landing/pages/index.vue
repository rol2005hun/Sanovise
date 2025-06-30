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
const features = computed(() => useI18n().tm('pages.index.features') as any[]);
const newsArticles = ref<any[]>([]);

const fetchNews = async () => {
  const apiKey = '845f4cfb-9408-4252-b5cb-75f2444f20f0';
  const url = `https://content.guardianapis.com/search?q=health&api-key=${apiKey}&show-fields=trailText&page-size=4`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.response.status === 'ok') {
      newsArticles.value = data.response.results.slice(0, 4).map((article: any) => ({
        title: article.webTitle,
        description: article.fields.trailText || 'No description available',
        url: article.webUrl
      }));
    } else {
      console.error('Failed to fetch news.');
    }
  } catch (error) {
    console.error('Error fetching news: ', error);
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