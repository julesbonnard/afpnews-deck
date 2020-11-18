<template>
    <div class="shortcuts">
        <div class="shortcuts-start">
            <p>Changer la langue de tous les contenus :</p>
            <select>
                <option disabled selected>Choix de la langue</option>
                <option>Français</option>
                <option>Anglais</option>
                <option>Allemand</option>
            </select>
        </div>
        <div class="shortcuts-end">
            <p>Réinitialiser tous les contenus</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Shortcuts'
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/variables.scss";
    .shortcuts{
        position: fixed;
        width: 100%;
        display: flex;
        align-items: stretch;
        flex-grow: 1;
        flex-shrink: 0;
        top: 7rem;
        padding: 0 2.5rem;
        .shortcuts-start{
            justify-content: flex-start;
            display: flex;

            select{
                background: transparent;
                border: none;
                color: $primary;
                outline: none;
                margin-left: 10px;
            }
        }
        .shortcuts-end{
            margin-left: auto;
            justify-content: flex-end;
            display: flex;
        }
    }
</style>