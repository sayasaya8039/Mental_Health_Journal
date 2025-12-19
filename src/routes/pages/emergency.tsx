import type { Context } from 'hono';
import { Layout } from '../../components/Layout';
import { HELPLINES } from '../../types';

export const EmergencyPage = (c: Context) => {
  return c.html(
    <Layout title="緊急連絡 - Mental Health Journal" currentPath="/emergency">
      {/* 緊急メッセージ */}
      <div class="card" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: 'white', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>🆘 緊急連絡</h2>
        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
          つらい時は、一人で抱え込まないでください。<br />
          誰かに話を聞いてもらうだけでも楽になれます。
        </p>
        <button id="sos-btn" class="btn" style={{ background: 'white', color: '#DC2626', fontWeight: 'bold', width: '100%' }}>
          🆘 SOSを送信する
        </button>
        <p style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-sm)', opacity: 0.8 }}>
          登録した緊急連絡先に通知が送られます
        </p>
      </div>

      {/* 相談窓口 */}
      <div class="card">
        <h3 class="card-title">📞 相談窓口</h3>
        <p class="text-secondary" style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.875rem' }}>
          24時間対応の相談窓口もあります。気軽にお電話ください。
        </p>

        <div class="helpline-list">
          {HELPLINES.map((helpline) => (
            <div class="helpline-item">
              <div class="helpline-info">
                <div class="helpline-name">{helpline.name}</div>
                <div class="helpline-hours">{helpline.hours}</div>
                <div class="helpline-desc">{helpline.description}</div>
              </div>
              <a href={`tel:${helpline.phone.replace(/-/g, '')}`} class="helpline-phone">
                📞 {helpline.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 深呼吸ガイド */}
      <div class="card">
        <h3 class="card-title">🧘 落ち着きたい時は</h3>
        <p class="text-secondary" style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.875rem' }}>
          深呼吸で心を落ち着けましょう
        </p>

        <div id="breathing-exercise" class="breathing-container">
          <div id="breathing-circle" class="breathing-circle">
            <span id="breathing-text">開始</span>
          </div>
          <button id="breathing-btn" class="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
            深呼吸を始める
          </button>
        </div>
      </div>

      {/* 自分を大切にするヒント */}
      <div class="card">
        <h3 class="card-title">💡 今すぐできること</h3>
        <ul class="tips-list">
          <li>🚰 コップ一杯の水を飲む</li>
          <li>🌬️ 深呼吸を3回する</li>
          <li>🚶 少しだけ体を動かす</li>
          <li>☀️ 窓を開けて外の空気を吸う</li>
          <li>🎵 好きな音楽を聴く</li>
          <li>🤗 自分を抱きしめる</li>
        </ul>
      </div>

      {/* 励ましメッセージ */}
      <div class="card text-center" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
          あなたは一人じゃありません 💙
        </p>
        <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.875rem' }}>
          辛い時期も、必ず過ぎていきます。<br />
          今日一日を乗り越えることができたあなたは強いです。
        </p>
      </div>

      <style>{`
        .helpline-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .helpline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
        .helpline-info {
          flex: 1;
        }
        .helpline-name {
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }
        .helpline-hours {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .helpline-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .helpline-phone {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--accent);
          color: var(--bg-primary);
          text-decoration: none;
          border-radius: var(--radius-full);
          font-weight: 500;
          font-size: 0.875rem;
          white-space: nowrap;
        }
        .breathing-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .breathing-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bg-primary);
          font-size: 1.25rem;
          font-weight: 600;
          transition: transform 4s ease-in-out;
        }
        .breathing-circle.inhale {
          transform: scale(1.3);
        }
        .breathing-circle.exhale {
          transform: scale(1);
        }
        .tips-list {
          list-style: none;
          padding: 0;
        }
        .tips-list li {
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--border);
        }
        .tips-list li:last-child {
          border-bottom: none;
        }
      `}</style>

      <script>{`
        // SOS送信
        document.getElementById('sos-btn').addEventListener('click', async function() {
          const contacts = JSON.parse(localStorage.getItem('emergency_contacts') || '[]');

          if (contacts.length === 0) {
            alert('緊急連絡先が登録されていません。\\n設定画面から連絡先を追加してください。');
            window.location.href = '/settings';
            return;
          }

          if (!confirm('緊急連絡先に通知を送信しますか？')) {
            return;
          }

          this.disabled = true;
          this.textContent = '送信中...';

          try {
            // 各連絡先に通知（実際の実装ではAPIを呼び出す）
            for (const contact of contacts) {
              if (contact.notifyOnSOS) {
                await fetch('/api/emergency/notify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contactId: contact.id,
                    message: 'SOSが送信されました。確認してください。'
                  })
                });
              }
            }

            alert('緊急連絡先に通知を送信しました。\\n連絡を待つか、相談窓口に電話してみてください。');
          } catch (error) {
            alert('通知の送信に失敗しました。\\n直接相談窓口に電話してください。');
          } finally {
            this.disabled = false;
            this.textContent = '🆘 SOSを送信する';
          }
        });

        // 深呼吸エクササイズ
        let breathingActive = false;
        let breathingInterval = null;

        document.getElementById('breathing-btn').addEventListener('click', function() {
          if (breathingActive) {
            stopBreathing();
          } else {
            startBreathing();
          }
        });

        function startBreathing() {
          breathingActive = true;
          const circle = document.getElementById('breathing-circle');
          const text = document.getElementById('breathing-text');
          const btn = document.getElementById('breathing-btn');
          btn.textContent = '停止する';

          let phase = 'inhale';
          let count = 0;

          function breathe() {
            if (phase === 'inhale') {
              circle.classList.remove('exhale');
              circle.classList.add('inhale');
              text.textContent = '吸う...';
              count++;
              setTimeout(() => {
                if (breathingActive) {
                  text.textContent = '止める...';
                  setTimeout(() => {
                    if (breathingActive) {
                      phase = 'exhale';
                      breathe();
                    }
                  }, 2000);
                }
              }, 4000);
            } else {
              circle.classList.remove('inhale');
              circle.classList.add('exhale');
              text.textContent = '吐く...';
              setTimeout(() => {
                if (breathingActive) {
                  if (count >= 5) {
                    stopBreathing();
                    text.textContent = '完了！';
                    setTimeout(() => {
                      text.textContent = '開始';
                    }, 2000);
                  } else {
                    phase = 'inhale';
                    breathe();
                  }
                }
              }, 4000);
            }
          }

          breathe();
        }

        function stopBreathing() {
          breathingActive = false;
          const circle = document.getElementById('breathing-circle');
          const btn = document.getElementById('breathing-btn');
          circle.classList.remove('inhale', 'exhale');
          document.getElementById('breathing-text').textContent = '開始';
          btn.textContent = '深呼吸を始める';
        }
      `}</script>
    </Layout>
  );
};
