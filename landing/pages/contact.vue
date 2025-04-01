<template>
    <div class="contact-container">
        <main class="contact-content">
            <section class="contact-info">
                <div class="info-card">
                    <h3>{{ $t('pages.contact.phone') }}</h3>
                    <a :href="'tel:' + $t('pages.contact.phoneNumber')">{{ $t('pages.contact.phoneNumber') }}</a>
                </div>
                <div class="info-card">
                    <h3>{{ $t('pages.contact.email') }}</h3>
                    <a :href="'mailto:' + $t('pages.contact.emailAddress', { dot: '@' })">{{
                        $t('pages.contact.emailAddress', { dot: '@' }) }}</a>
                </div>
                <div class="info-card">
                    <h3>{{ $t('pages.contact.address') }}</h3>
                    <p>{{ $t('pages.contact.addressDetails') }}</p>
                </div>
            </section>

            <section class="maps-form">
                <iframe style="border: 0;" loading="lazy" allowfullscreen
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJz2N7xdwNR0cRa7C8gsfrJoQ&key=AIzaSyBvm-ltijTAkX-Ov1WH-TxtpJDzyKUrQi4"></iframe>

                <section class="contact-form">
                    <h2>{{ $t('pages.contact.contactFormTitle') }}</h2>

                    <form action="https://formsubmit.co/botpingie@gmail.com" method="POST">
                        <label for="name">{{ $t('pages.contact.nameLabel') }}<span class="required">*</span></label>
                        <input id="name" name="name" type="text" :placeholder="$t('pages.contact.namePlaceholder')"
                            required />

                        <label for="email">{{ $t('pages.contact.emailLabel') }}<span class="required">*</span></label>
                        <input id="email" type="email" name="email"
                            :placeholder="$t('pages.contact.emailPlaceholder', { dot: '@' })" required />

                        <label for="message">{{ $t('pages.contact.messageLabel') }}<span
                                class="required">*</span></label>
                        <textarea id="message" name="description" :placeholder="$t('pages.contact.messagePlaceholder')"
                            required></textarea>

                        <div class="send-btn">
                            <button type="submit">{{ $t('pages.contact.submitButton') }}</button>
                            <div class="send-btn-labels">
                                <input type="checkbox" name="agree" id="agree" required>
                                <label for="agree">{{ $t('pages.contact.agreeLabel') }}</label>
                            </div>
                        </div>
                    </form>
                </section>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/contact.scss';
</style>