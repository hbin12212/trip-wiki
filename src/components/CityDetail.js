export default function CityDetail({ $app, initialState }) {
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'city-detail';

    $app.appendChild(this.$target);

    const getScoreColor = (score) => {
        if (score >= 4) return 'green';
        if (score >= 3) return 'yellow';
        return 'red';
    };

    this.template = () => {
        let cityData = this.state.cityDetail;
        let temp = ``;
        if (cityData) {
            temp = `<div class="image-banner">
                <img src="${cityData.image}" />
                <div class="city-name">
                    <div class="city">${cityData.city}</div>               
                    <div class="country">${cityData.region} / ${cityData.country}</div>
                </div>
            </div>
            <div class="progress-container">
                    <div class="info-item">
                        <div class="label">⭐ Total Score</div>
                        <div class="progress-bar" score-color="${getScoreColor(cityData.total)}" style="--score: ${
                cityData.total * 20
            }%"></div>
                    </div>
                    <div class="info-item">
                        <div class="label">💵 Cost</div>
                        <div class="progress-bar" score-color="${getScoreColor(cityData.info.cost)}" style="--score: ${
                cityData.info.cost * 20
            }%"></div>
                    </div>
                    <div class="info-item">
                        <div class="label">😆 Fun</div>
                        <div class="progress-bar" score-color="${getScoreColor(cityData.info.fun)}" style="--score: ${
                cityData.info.fun * 20
            }%"></div>
                    </div>
                    <div class="info-item">
                        <div class="label">🚓 Safety</div>
                        <div class="progress-bar" score-color="${getScoreColor(
                            cityData.info.safety
                        )}" style="--score: ${cityData.info.safety * 20}%"></div>
                    </div>
                    <div class="info-item">
                        <div class="label">🛜 Internet</div>
                        <div class="progress-bar" score-color="${getScoreColor(
                            cityData.info.internet
                        )}" style="--score: ${cityData.info.internet * 20}%"></div>
                    </div>
                    <div class="info-item">
                        <div class="label">💨 Air Condition</div>
                        <div class="progress-bar" score-color="${getScoreColor(cityData.info.air)}" style="--score: ${
                cityData.info.air * 20
            }%"></div>
                    </div>
                    <div class="info-item">
                        <div class="label">🍖 Food</div>
                        <div class="progress-bar" score-color="${getScoreColor(cityData.info.food)}" style="--score: ${
                cityData.info.food * 20
            }%"></div>
                    </div>
                </div>
            `;
        }
        return temp;
    };

    this.render = () => {
        this.$target.innerHTML = this.template();
    };

    this.render();
}
