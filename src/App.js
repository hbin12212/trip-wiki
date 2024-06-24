//COMPONENTS
import Header from './components/Header.js';
import RegionList from './components/RegionList.js';
import CityList from './components/CityList.js';
import CityDetail from './components/CityDetail.js';
//API
import { request, requestCityDetail } from './components/api.js';

export default function App($app) {
    const getSortBy = () => {
        if (window.location.search) {
            return window.location.search.split('sort=')[1].split('&')[0];
        }
        return 'total';
    };

    const getSearchWord = () => {
        if (window.location.search && window.location.search.includes('search=')) {
            return window.location.search.split('search=')[1];
        }
        return '';
    };

    this.state = {
        startIdx: 0,
        sortBy: getSortBy(),
        region: window.location.pathname.replace('/', ''),
        searchWord: getSearchWord(),
        cities: '',
        currentPage: window.location.pathname,
    };

    const renderHeader = () => {
        new Header({
            $app,
            initialState: {
                currentPage: this.state.currentPage,
                sortBy: this.state.sortBy,
                searchWord: this.state.searchWord,
            },
            handleSortChange: async (sortBy) => {
                const pageUrl = `/${this.state.region}?sort=${sortBy}`;
                history.pushState(
                    null,
                    null,
                    this.state.searchWord ? pageUrl + `&search=${this.state.searchWord}` : pageUrl
                );
                const cities = await request(0, this.state.region, sortBy, this.state.searchWord);
                this.setState({
                    ...this.state,
                    startIdx: 0,
                    sortBy: sortBy,
                    cities: cities,
                });
            },
            handleSearch: async (searchWord) => {
                history.pushState(null, null, `/${this.state.region}?sort=${this.state.sortBy}&search=${searchWord}`);
                const cities = await request(0, this.state.region, this.state.sortBy, searchWord);
                this.setState({
                    ...this.state,
                    startIdx: 0,
                    cities: cities,
                    searchWord: searchWord,
                });
            },
        });
    };

    const renderRegionList = () => {
        new RegionList({
            $app,
            initialState: this.state.region,
            handleRegion: async (region) => {
                history.pushState(null, null, `/${region}?sort=total`);
                const cities = await request(0, region, 'total');
                this.setState({
                    ...this.state,
                    startIdx: 0,
                    sortBy: 'total',
                    region: region,
                    cities: cities,
                    searchWord: '',
                    currentPage: `/${region}`,
                });
            },
        });
    };

    const renderCityList = () => {
        new CityList({
            $app,
            initialState: this.state.cities,
            handleItemClick: async (id) => {
                history.pushState(null, null, `/city/${id}`);
                this.setState({
                    ...this.state,
                    currentPage: `/city/${id}`,
                });
            },
            handleLoadMore: async () => {
                const newStartIdx = this.state.startIdx + 40;
                const newCities = await request(newStartIdx, this.state.region, this.state.sortBy);
                this.setState({
                    ...this.state,
                    startIdx: newStartIdx,
                    cities: {
                        ...this.state.cities,
                        cities: [...this.state.cities.cities, ...newCities.cities],
                        isEnd: newCities.isEnd,
                    },
                });
            },
        });
    };

    const renderCityDetail = async (cityId) => {
        try {
            const cityDetailData = await requestCityDetail(cityId);
            new CityDetail({ $app, initialState: cityDetailData });
        } catch (error) {
            console.log(error);
        }
    };

    const render = async () => {
        const path = this.state.currentPage;
        $app.innerHTML = '';
        // 상세 페이지로 이동
        if (path.startsWith('/city/')) {
            const cityId = path.split('/city/')[1];
            renderHeader();
            renderCityDetail(cityId);
        } else {
            renderHeader();
            renderRegionList();
            renderCityList();
        }
    };

    this.setState = (newState) => {
        this.state = newState;
        render();
    };

    const init = async () => {
        const path = this.state.currentPage;
        // 메인 페이지
        if (!path.startsWith('/city/')) {
            const cities = await request(
                this.state.startIdx,
                this.state.region,
                this.state.sortBy,
                this.state.searchWord
            );
            this.setState({
                ...this.state,
                cities: cities,
            });
        } //상세 페이지
        else {
            render();
        }
    };

    window.addEventListener('popstate', async () => {
        const urlPath = window.location.pathname;

        const prevRegion = urlPath.replace('/', '');
        const prevPage = urlPath;
        const prevSortBy = getSortBy();
        const prevSearchWord = getSearchWord();
        const prevStartIdx = 0;
        const prevCities = await request(prevStartIdx, prevRegion, prevSortBy, prevSearchWord);

        this.setState({
            ...this.state,
            startIdx: prevStartIdx,
            sortBy: prevSortBy,
            region: prevRegion,
            currentPage: prevPage,
            searchWord: prevSearchWord,
            cities: prevCities,
        });
    });

    init();
}
