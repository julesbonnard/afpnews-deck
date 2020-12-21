<template>
  <section class="column">
    <search-params
      :column-id="columnId"
      @reset="reset"
      @close="close"
      @move="dir => move(dir)"
    />
    <recyclist-native
      v-if="recyclistNative"
      ref="recyclist"
      :list="documents"
      :size="10"
      :offset="200"
      :is-loading="$wait.is(`column.refreshing.${column.id}`)"
      :no-more="noMore"
      :column-id="columnId"
      class="documents"
      @load-top="loadAfter"
      @load-bottom="loadBefore"
    >
      <template #tombstone>
        <content-placeholders
          :animated="true"
          :rounded="true"
          :centered="false"
          class="tombstone"
        >
          <content-placeholders-heading :img="false" />
          <content-placeholders-img />
          <content-placeholders-text :lines="2" />
        </content-placeholders>
      </template>
      <template #item="{ data }">
        <div
          v-if="data.includes('documents-gap')"
          class="documents-gap"
        >
          <p>
            {{ $tc('column.documents-gap', parseInt(data.split('|')[2]), { count: parseInt(data.split('|')[2]) }) }}
            <router-link
              to="/"
              @click.native="reset"
            >
              {{ $t('column.refresh') }}
            </router-link>
          </p>
        </div>
        <card
          v-else
          :doc-id="data"
          :index-col="columnId"
        />
      </template>
      <template #nomore>
        <span>{{ $t('column.no-result') }}</span>
      </template>
    </recyclist-native>
    <recyclist
      v-else
      ref="recyclist"
      :list="documents"
      :size="10"
      :offset="200"
      :is-loading="$wait.is(`column.refreshing.${column.id}`)"
      :no-more="noMore"
      class="documents"
      @load-top="loadAfter"
      @load-bottom="loadBefore"
    >
      <template #tombstone>
        <content-placeholders
          :animated="true"
          :rounded="true"
          :centered="false"
          class="tombstone"
        >
          <content-placeholders-heading :img="false" />
          <content-placeholders-img />
          <content-placeholders-text :lines="2" />
        </content-placeholders>
      </template>
      <template #item="{ data }">
        <div
          v-if="data.includes('documents-gap')"
          class="documents-gap"
        >
          <p>
            {{ $tc('column.documents-gap', parseInt(data.split('|')[2]), { count: parseInt(data.split('|')[2]) }) }}
            <router-link
              to="/"
              @click.native="reset"
            >
              {{ $t('column.refresh') }}
            </router-link>
          </p>
        </div>
        <card
          v-else
          :doc-id="data"
          :index-col="columnId"
        />
      </template>
      <template #nomore>
        <span>{{ $t('column.no-result') }}</span>
      </template>
    </recyclist>
  </section>
</template>

<script>
import SearchParams from '@/components/SearchParams'
import Recyclist from '@/components/Recyclist'
import RecyclistNative from '@/components/RecyclistNative'
import { ContentPlaceholders, ContentPlaceholdersHeading, ContentPlaceholdersImg, ContentPlaceholdersText } from 'vue-content-placeholders'
import Card from '@/components/Card'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Column',
  components: {
    Card,
    Recyclist,
    ContentPlaceholders,
    ContentPlaceholdersHeading,
    ContentPlaceholdersImg,
    ContentPlaceholdersText,
    SearchParams,
    RecyclistNative
  },
  props: {
    columnId: {
      type: Number,
      required: true
    },
    columnType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      noMore: false,
      recyclistNative: true
    }
  },
  computed: {
    ...mapGetters([
      'getColumnByIndex',
      'getDocumentsIdsByColumnId',
      'isAuthenticated'
    ]),
    column () {
      return this.getColumnByIndex(this.columnId)
    },
    documents () {
      return this.getDocumentsIdsByColumnId(this.columnId)
    },
    params () {
      return this.column.params
    }
  },
  methods: {
    ...mapMutations([
      'resetColumn',
      'moveColumn',
      'closeColumn'
    ]),
    ...mapActions([
      'refreshColumn'
    ]),
    reset () {
      this.noMore = false
      this.resetColumn({ indexCol: this.columnId })
      this.$refs.recyclist.reset()
    },
    async loadBefore () {
      try {
        const gotNewDocuments = await this.refreshColumn({ indexCol: this.columnId, mode: 'before' })
        if (gotNewDocuments === false) {
          this.noMore = true
        }
      } catch (error) {
        this.$toasted.global.apiError(error)
      }
    },
    loadAfter () {
      try {
        return this.refreshColumn({ indexCol: this.columnId, mode: 'after' })
      } catch (error) {
        this.$toasted.global.apiError(error)
      }
    },
    move (dir) {
      this.moveColumn({ indexCol: this.columnId, dir })
    },
    close () {
      this.closeColumn({ indexCol: this.columnId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.column {
  min-width: $column-size;
  width: $column-size;
  height: 100%;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
  content-visibility: 'auto';

  h2.error {
    text-align: center;
    padding: 5px;
  }

  .documents {
    flex: 1;
    padding: 0px 17px 0px 12px;
    transform: translateX(-3px);
    overflow: auto;

    .tombstone {
      padding: 12px;
      user-select: none;
    }

    .documents-gap {
      padding: 12px;
      text-align: center;
      a, a:visited {
        color: #aaa;
      }
    }
  }
}

.curtain-enter {
  opacity: 0;
  transform: translateY(-30px);
}
.curtain-enter-active {
  transition: opacity 0.5s, transform 0.5s;
}
.curtain-enter-to {
  opacity: 1;
  transform: translateY(0px);
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 28px 0;
  }
}
</style>

<style lang="scss">
@import "@/assets/scss/variables.scss";
</style>
