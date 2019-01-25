(() => {
    $('body').append(`
    <div class='form-holder'>
        <form name='order' class='cake' autocomplete="on">
            <div class='form-header'>
                <div class='form-close'></div>
                <p class='order-header'>Замовлення № <span class='order-number'></span></p>
            </div>
            <fieldset id='client-fieldset'>
                <legend align='center'>Замовник:</legend>
                <div class='fieldset-items'>
                    <div class='details-left'>
                        <label for="name">Ім'я:</label>
                        <input type="text" name="name" placeholder="Ім'я" required><br>
                        <label for="surname">Прізвище:</label>
                        <input type="text" name="surname" placeholder="Прізвище"><br>
                        <label for="tel">Номер тел.:</label>
                        <input type="text" name="tel" placeholder="Телефон"><br>
                        <label for="avatar">Ссилка на фото клієнта:</label>
                        <input type="url" id='avatar-link' name="avatar" placeholder="URL аватарки">
                    </div>
                    <div class='details-simple'>
                        <img id='avatar-img' src="./pic/noavatar.jpg" alt='аватарка'></img>
                    </div>
                </div>
            </fieldset>
            <fieldset id='cake-fieldset'>
                <legend align='center'>Найголовніше:</legend>
                <div class='fieldset-items'>
                    <div class='details-left'>
                        <label for="cake_type">Оздоблення:</label>
                        <select name='cake_type' required>
                            <option value='Мастіка'>Мастіка</option>
                            <option value='Крем'>Крем</option>
                            <option value='Дзеркальна глазур'>Дзеркальна глазур</option>
                            <option value='Шоколадна заливка'>Шоколадна заливка</option>
                        </select><br>
                        <label for="theme">Тематика:</label>
                        <input type="text" name="theme" placeholder="Тема торта" required><br>
                        <label for="deadline">На коли:</label>
                        <input type="date" name="deadline" required><br>
                        <label for="desired_weight">Бажана вага:</label>
                        <input type="text" name="desired_weight" placeholder="Бажана вага"><br>
                    </div>
                    <div class='details-right'>
                        <label for="desired_value">Бажана ціна:</label>
                        <input type="text" name="desired_value" placeholder="Бажана ціна"><br>
                        <label for="base_price">Ціна за кг:</label>
                        <input type="text" name="base_price" value='270'required><br>
                        <label for='diameter'>d коржів: </label>
                        <select name='diameter' required>
                            <option value='18 см'>18 см</option>
                            <option value='22 см'>22 см</option>
                            <option value='25 см'>25 см</option>
                            <option value='28 см'>28 см</option>
                            <option value='Інше'>Інше</option>
                        </select><br>
                        <label for="prototype">Лінк на прототип:</label>
                        <input type="url" id='prototype-link' name="prototype" placeholder='Ссилка на торт-приклад'>
                    </div>
                    <div class='details-simple'>
                        <img id='prototype-img' src='./pic/cake.jpg'>
                    </div>
                </div>
            </fieldset>
            <fieldset id='sponges-fieldset'>
                <legend align='center'>Коржі:</legend>
                <div class='details-simple'>
                    <label><input type="checkbox" name="sponges" value='ванільні'><span>Ванільні</span></label>
                    <label><input type="checkbox" name="sponges" value='шоколадні'><span>Шоколадні</span></label>
                    <label><input type="checkbox" name="sponges" value='горіхові'><span>Горіхові</span></label>
                    <label><input type="checkbox" name="sponges" value='червоний оксамит'><span>Червоний оксамит</span></label>
                    <label><input type="checkbox" name="sponges" value='медові'><span>Медові</span></label>
                    <label><input type="checkbox" name="sponges" value='кокосові'><span>Кокосові</span></label>
                    <label><input type="checkbox" name="sponges" value='кольорові'><span>Кольорові</span></label>
                </div>
            </fieldset>
            <fieldset id='fillings-fieldset'>
                <legend align='center'>Начинки:</legend>
                <div class='details-simple'>
                    <label><input type="checkbox" name="fillings" value='персики'><span>Персики</span></label>
                    <label><input type="checkbox" name="fillings" value='банани'><span>Банани</span></label>
                    <label><input type="checkbox" name="fillings" value='вишня'><span>Вишня</span></label>
                    <label><input type="checkbox" name="fillings" value='чорниця'><span>Чорниця</span></label>
                    <label><input type="checkbox" name="fillings" value='малина'><span>Малина</span></label>
                    <label><input type="checkbox" name="fillings" value='чорна смородина'><span>Чорна смородина</span></label>
                    <label><input type="checkbox" name="fillings" value='ананаси'><span>Ананаси</span></label>
                    <label><input type="checkbox" name="fillings" value='горіхи'><span>Горіхи</span></label>
                    <label><input type="checkbox" name="fillings" value='кокос'><span>Кокос</span></label>
                </div>
            </fieldset>
            <fieldset id='cream-fieldset'>
                <legend align='center'>Крем:</legend>
                <div class='details-simple'>
                    <label><input type="checkbox" name="cream" value='сметанковий'><span>Сметанковий</span></label>
                    <label><input type="checkbox" name="cream" value='маскарпоне+вершки'><span>Маскарпоне + вершки</span></label>
                    <label><input type="checkbox" name="cream" value='маскарпоне+шоколад'><span>Маскарпоне + шоколад</span></label>
                    <label><input type="checkbox" name="cream" value='масло+шоколад'><span>Масло + шоколад</span></label><br>
                    <label><input type="checkbox" name="cream" value='масло+згущонка'><span>Масло + згущонка</span></label>
                    <label><input type="checkbox" name="cream" value='творожний'><span>Творожний</span></label>
                    <label><input type="checkbox" name="cream" value='заварний+згущонка'><span>Заварний + згущонка</span></label>
                    <label><input type="checkbox" name="cream" value='заварний+шоколад'><span>Заварний + шоколад</span></label>
                </div>
            </fieldset>
            <fieldset id='comments-fieldset'>
                <div class='fieldset-items'>
                    <div class='details-simple'>
                        <label><input type="checkbox" name="delivery" value='з доставкою'><span>ДОСТАВКА</span></label>
                    </div>
                    <div class='details-simple'>
                        <label id='comments-label' for="comments">Коментар: </label>
                        <textarea rows="3" cols="60" name="comments"></textarea>
                    </div>
                </div>
            </fieldset>
            <fieldset id='result-fieldset'>
                <legend align='center'>Результат:</legend>
                <div class='fieldset-items'>
                    <div class='details-left'>
                        <label for="result_photo">Лінк на результат:</label>
                        <input type="url" id='result-link' name="result_photo" placeholder='Ссилка на результат'><br>
                        <label for="final_weight">Фінальна вага:</label>
                        <input type="text" name="final_weight" placeholder="Фінальна вага"><br>
                        <label for="final_value">Фінальна ціна:</label>
                        <input type="text" name="final_value" placeholder="Фінальна ціна"><br>
                        <label for='cake_section'>Тематичний розділ: </label>
                        <select name='cake_section'>
                            <option value='Тематичні' selected>Тематичні</option>
                            <option value='Для дівчат'>Для дівчат</option>
                            <option value='Для хлопчиків'>Для хлопчиків</option>
                            <option value='Жінкам'>Жінкам</option>
                            <option value='Чоловікам'>Чоловікам</option>
                            <option value='На хрестини'>На хрестини</option>
                            <option value='Весільні'>Весільні</option>
                        </select>
                    </div>
                    <div class='details-simple'>
                        <img id='result-img' src="./pic/cake.jpg"></img>
                    </div>
                </div>
            </fieldset>
            <div class='form-buttons'>
                <button type='submit' class='submit-new action-button green-btn'>
                    Зберегти <i class="far fa-save"></i>
                </button>
                <button type='reset' class='reset-btn action-button red-btn'>
                    Очистити <i class="fas fa-sync-alt"></i>
                </button>
                <button type='button' class='delete-btn action-button red-btn'>
                    Видалити <i class="far fa-trash-alt"></i>
                </button>
                <button type='button' class='close-btn action-button grey-btn'>
                    Закрити <i class="fas fa-times"></i>
                </button>
                <div class='invisible'>
                    <label for="client_id">клієнт №</label>
                    <input type="text" name="client_id" readonly><br>
                    <label for="order_id">замовлення №</label>
                    <input type="text" name="order_id" readonly><br>
                </div>
            </div>
        </form>
    </div>
    `);
})();