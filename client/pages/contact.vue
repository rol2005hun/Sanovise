<template>
    <div class="contact-container">
        <main class="contact-content">
            <section class="contact-info">
                <div class="info-card">
                    <h3>Telefon</h3>
                    <p>+36 123 456 789</p>
                </div>
                <div class="info-card">
                    <h3>Email</h3>
                    <p>info@sanovise.hu</p>
                </div>
                <div class="info-card">
                    <h3>Cím</h3>
                    <p>Debrecen, Kassai út 1.</p>
                </div>
            </section>

            <section class="contact-form">
                <h2>Írj nekünk</h2>

                <form action="https://formsubmit.co/botpingie@gmail.com" method="POST">
                    <label for="name">Név<span class="required">*</span></label>
                    <input id="name" name="name" type="text" placeholder="Dr. Sanovise Mi" required />

                    <label for="email">Email<span class="required">*</span></label>
                    <input id="email" type="email" name="email" placeholder="pl.:info@sanovise.hu" required />

                    <label for="message">Üzenet<span class="required">*</span></label>
                    <textarea id="message" name="description" placeholder="pl.: Hiba van a rendszerrel!"
                        required></textarea>

                    <div class="send-btn">
                        <button type="submit">Küldés</button>
                        <div class="send-btn-labels">
                            <input type="checkbox" name="agree" id="agree" required>
                            <label for="agree">Elfogadom az üzenetküldési feltételeket.</label>
                        </div>
                    </div>
                </form>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/contact.scss';
</style>