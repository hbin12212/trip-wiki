export default function RegionList({ $app, initialState, handleRegion }) {
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'region-list';

    this.handleRegion = handleRegion;
    $app.appendChild(this.$target);

    this.template = () => {
        const regionList = [
            '🚀 All',
            '🌏 Asia',
            '🕌 Middle-East',
            '🇪🇺 Europe',
            '💃 Latin-America',
            '🐘 Africa',
            '🏈 North-America',
            '🏄 Oceania',
        ];
        let temp = ``;
        regionList.forEach((elm) => {
            let regionId = elm.split(' ')[1];
            temp += `<div id=${regionId}>${elm}</div>`;
        });
        return temp;
    };

    this.render = () => {
        this.$target.innerHTML = this.template();
        let $currentRegion;
        if (this.state) {
            $currentRegion = document.getElementById(this.state);
            $currentRegion && ($currentRegion.className = 'clicked');
        } else {
            document.getElementById('All').className = 'clicked';
        }

        const $regionList = this.$target.querySelectorAll('div');
        $regionList.forEach((elm) => {
            elm.addEventListener('click', () => {
                this.handleRegion(elm.id);
            });
        });
    };

    this.setState = (newState) => {
        this.state = newState;
        this.render();
    };

    this.render();
}
