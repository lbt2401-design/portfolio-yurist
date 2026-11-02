/**
 * Логика лендинга «Чистый лист» (демо для портфолио):
 *  1. Маска телефона и проверка формы.
 *  2. Отправка заявки: в демо не отправляем, показываем пояснение.
 */
(function () {
  'use strict';

  var config = window.SITE_CONFIG || {};
  var log = Logger.create('main');

  var form = document.getElementById('signup-form');
  var status = form.querySelector('.form__status');
  var phoneInput = form.elements.phone;

  // Маска: +7 (900) 000-00-00
  phoneInput.addEventListener('input', function () {
    var digits = phoneInput.value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    var d = digits.slice(1, 11);
    var out = '+7';
    if (d.length) out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ') ' + d.slice(3, 6);
    if (d.length >= 6) out += '-' + d.slice(6, 8);
    if (d.length >= 8) out += '-' + d.slice(8, 10);
    phoneInput.value = out;
  });

  function setStatus(text, type) {
    status.textContent = text;
    status.className = 'form__status' + (type ? ' form__status--' + type : '');
  }

  function validate() {
    var errors = [];
    form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
    if (form.elements.name.value.trim().length < 2) { errors.push('имя'); form.elements.name.classList.add('invalid'); }
    if (phoneInput.value.replace(/\D/g, '').length !== 11) { errors.push('телефон'); phoneInput.classList.add('invalid'); }
    if (!form.elements.consent.checked) errors.push('согласие на обработку данных');
    return errors;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var errors = validate();
    if (errors.length) {
      setStatus('Проверьте поля: ' + errors.join(', ') + '.', 'error');
      log.info('validation failed', { fields: errors });
      return;
    }
    // В лог – без персональных данных: только маскированный телефон и диапазон долга
    var ctx = { phoneMasked: phoneInput.value.slice(0, 4) + '***' + phoneInput.value.slice(-2), debt: form.elements.debt.value };
    if (config.demo) {
      setStatus('Это демо-сайт для портфолио: заявка никуда не отправлена. На рабочем сайте она сразу уходит юристу.', 'ok');
      log.info('demo submit skipped', ctx);
      return;
    }
    log.warn('form endpoint not configured', ctx);
  });

  log.info('page ready', { demo: !!config.demo });
})();
