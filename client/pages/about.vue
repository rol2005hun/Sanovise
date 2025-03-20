<template>
    <div class="about">
        <div class="description">
            <p>
                Üdvözöljük az egészségügyi tanácsadás új dimenziójában! Célunk, hogy egy digitális egészségügyi
                asszisztens segítségével támogassuk
                felhasználóinkat az egészségtudatosságuk növelésében. Az alkalmazásunk mesterséges intelligenciára épül,
                és lehetővé teszi a személyre szabott egészségügyi elemzést.
            </p>
        </div>

        <div class="goal">
            <h2>Célunk</h2>
            <p>
                Egy olyan innovatív platform létrehozása, amely az Ön egészségügyi adatait elemezve hasznos
                információkat nyújt. Az asszisztensünk átlagos
                pulzusszám, vérnyomás, jelenlegi gyógyszerek, orvosi leletek, születési dátum, súly, magasság és egyéb
                adatok alapján segít megérteni az
                egészségi állapotát, és előre jelezheti a lehetséges egészségügyi problémákat.
                <span style="color: red;">Fontos, hogy ez az alkalmazás nem helyettesíti az orvosi konzultációt</span>.
            </p>
        </div>

        <div class="functions">
            <h2>Fő funkciók</h2>
            <ul>
                <li>Felhasználói egészségügyi adatok elemzése</li>
                <li>Személyre szabott egészségügyi tanácsadás</li>
                <li>Adatok exportálása és importálása JSON formátumban</li>
                <li>Intuitív és reszponzív felhasználói felület</li>
            </ul>
        </div>

        <div class="how-to">
            <h2>Hogyan működik?</h2>
            <p>
                Az alkalmazásunk egyszerűen használható:
            </p>
            <ol>
                <li>Látogasson el a <NuxtLink to="myself">Sanovite Myself</NuxtLink> oldalára.</li>
                <li>Adja meg egészségügyi adatait, mint például pulzusszám, vérnyomás, magasság, súly stb.</li>
                <li>Az alkalmazás mesterséges intelligencia segítségével elemzi az adatokat.</li>
                <li>Kapjon visszajelzést egészségi állapotáról, és tájékozódjon a lehetséges betegségekről.</li>
            </ol>
        </div>

        <div class="why-us">
            <h2>Miért válassza ezt az alkalmazást?</h2>
            <p>
                Az egészségügyi tanácsadó rendszerünk modern technológiára épül, amely egyszerűsíti az egészségügyi
                adatainak kezelését és elemzését.
                Az intuitív felhasználói felület és a mesterséges intelligencia integrációja segítségével átfogó képet
                kaphat az egészségi állapotáról.
                Ideális választás mindenkinek, aki aktívan szeretné figyelemmel kísérni és javítani az egészségét.
            </p>

            <p>
                Köszönjük, hogy minket választott, és lehetőséget ad arra, hogy támogassuk Önt az egészségtudatos életmód felé vezető úton!
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use "@/assets/styles/pages/about.scss";
</style>
