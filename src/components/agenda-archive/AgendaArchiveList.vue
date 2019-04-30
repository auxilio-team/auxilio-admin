<template>
  <div>
    <VContainer fluid class="pb-0">
      <VLayout>
        <VFlex xs12> <div class="headline">Agenda Archives</div> </VFlex>
      </VLayout>
    </VContainer>
    <VContainer class="pt-2" fluid grid-list-lg>
      <VLayout wrap>
        <VFlex xs12>
          <VCard class="pt-2">
            <VToolbar flat color="white">
              <div color="primary" class="pa-0 pl-2 pr-3"></div>
              <VSpacer />

              <VFlex xs12 md4>
                <VTextField v-model="search" :label="'search'" single-line append-icon="search" />
              </VFlex>
            </VToolbar>

            <VDataTable
              :headers="headers"
              :items="items"
              :loading="loading"
              :total-items="totalItems"
              disable-initial-sort
              :pagination.sync="pagination"
              @update:pagination="loadData"
            >
              <template slot="headerCell" slot-scope="{ header }">
                <span class="table-header-text caption font-weight-bold">
                  {{ header.textKey }}
                </span>
              </template>
              <template slot="items" slot-scope="{ index, item }">
                <td>{{ index + 1 }}</td>
                <td>{{ item.title }}</td>
                <td>
                  <!-- <tr v-for="subTopic of item.subTopics.rows" :key="subTopic.id"> -->
                  <!-- <td>{{ subTopic.title }}</td> -->

                  <!-- <span v-if="subTopic">
                      <td v-for="feedback of subTopic.feedbacks" :key="feedback.id">
                        {{ feedback.body }}
                      </td>
                    </span> -->
                  <!-- <td v-for="feedback of subtopic.feedbacks.rows" :key="feedback.id">
                      {{ feedback.title }}
                    </td> -->
                  <!-- </tr> -->
                  <table>
                    <tr v-for="subTopic of item.subTopics.rows" :key="subTopic.id">
                      <td>{{ subTopic.title }}</td>
                      <table>
                        <tr v-for="feedback of subTopic.feedbacks" :key="feedback.id">
                          <td><VIcon>comment</VIcon>{{ feedback.body }}</td>
                        </tr>
                      </table>
                    </tr>
                  </table>
                </td>
              </template>
            </VDataTable>
          </VCard>
        </VFlex>
      </VLayout>
    </VContainer>
  </div>
</template>

<script>
import { AgendaArchiveAPI } from '@/api';
import { buildFilter, buildSearchFilter } from '@/util';

const debounce = require('lodash.debounce');

const ITEMS_PER_PAGE = 25;

export default {
  name: 'AgendaArchiveList',
  data() {
    return {
      search: '',
      searchStarted: false,
      items: [],
      loading: false,
      totalItems: 0,
      pagination: {
        skip: 1,
        rowsPerPage: ITEMS_PER_PAGE
      },
      searchField: 'title',
      headers: [
        { textKey: '#', value: 'id', sortable: false },
        { textKey: 'Agenda', value: 'title' },
        { textKey: 'SubTopic', value: 'subTopics' }
      ]
    };
  },
  methods: {
    doSearch: debounce(async function s() {
      if (this.searchField && this.search) {
        this.loadData(buildSearchFilter(this.searchField, this.search));
      } else {
        this.loadData();
      }
    }, 500),
    async loadData() {
      const { rows, count } = await AgendaArchiveAPI.all();
      this.items = rows;
      this.totalItems = count;
      this.loading = false;
    }
  },
  watch: {
    pagination: {
      handler() {
        this.loadData();
      },
      deep: true
    },
    search: {
      handler() {
        this.doSearch();
      }
    }
  }
};
</script>
