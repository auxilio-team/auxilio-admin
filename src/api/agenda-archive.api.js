import { API_ROOT } from './index';
import Request from './request';

const PATH = '/MainTopics';

const AgendaArchiveAPI = {
  all(filter) {
    return Request.get(`${API_ROOT}${PATH}/list`, {
      params: filter
    });
  }
};

export default AgendaArchiveAPI;
