
// storage & data management

const Storage = {
  get: (key, defaultValue) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },

  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
};

const DataStore = {
  priorities: () => Storage.get('priorities', []),
  savePriorities: (data) => Storage.set('priorities', data),

  intentions: () => Storage.get('intentions', []),
  saveIntentions: (data) => Storage.set('intentions', data),

  affirmations: () => Storage.get('affirmations', []),
  saveAffirmations: (data) => Storage.set('affirmations', data),

  reminders: () => Storage.get('reminders', {}),
  saveReminders: (data) => Storage.set('reminders', data),

  tracker: () => Storage.get('tracker', []),
  saveTracker: (data) => Storage.set('tracker', data),

  connectTemplates: () => Storage.get('connectTemplates', []),
  saveConnectTemplates: (data) => Storage.set('connectTemplates', data),

  followupClients: () => Storage.get('followupClients', []),
  saveFollowupClients: (data) => Storage.set('followupClients', data),

  closeAccounts: () => Storage.get('closeAccounts', []),
  saveCloseAccounts: (data) => Storage.set('closeAccounts', data),

  closeForgiveness: () => Storage.get('closeForgiveness', []),
  saveCloseForgiveness: (data) => Storage.set('closeForgiveness', data),

  reflections: () => Storage.get('reflections', []),
  saveReflections: (data) => Storage.set('reflections', data),

  theme: () => Storage.get('theme', 'dark'),
  saveTheme: (theme) => Storage.set('theme', theme),

  closedOnboarding: () => Storage.get('closedOnboarding', {}),
  saveClosedOnboarding: (closed) => Storage.set('closedOnboarding', closed),
  reminders: () => Storage.get('reminders', []),
  saveReminders: (reminders) => Storage.set('reminders', reminders),
  routineItems: () => Storage.get('routineItems', {}),
  saveRoutineItems: (items) => Storage.set('routineItems', items)
};


// state management

const State = {
  currentMainTab: 'plan',
  currentSubTab: {
    plan: 'priorities',
    flow: 'connect',
    shift: 'activate',
    set: 'remind'
  },
  closeSubTab: 'professional',
  currentMood: null,
  activateTimer: null,
  activateTimerInterval: null,
  activeExercise: null,
  exerciseSetup: {
    focusedAttention: { selectedPriorities: [], duration: 5, currentItemIdx: 0 },
    generativeVisualization: { selectedIntention: null, duration: 5 },
    emotionCultivation: { selectedAffirmations: [], duration: 5, currentItemIdx: 0 },
    breathRegulation: { type: 'calming', intervals: 5, inhaleTime: 4, holdTime: 4, exhaleTime: 4, currentCycle: 0, currentPhase: 'inhale' }
  },
  showMeditationSetup: false,
  meditationType: 'open',
  meditationDuration: 5,
  customDuration: '',
  backgroundSound: 'silent',
  endingSound: 'gong',
  theme: DataStore.theme(),
  closedOnboarding: DataStore.closedOnboarding ? DataStore.closedOnboarding() : {},
  expandedPriorities: {},
  editingPriorityIdx: null,
  editingPriorityTitle: '',
  expandedIntentions: {},
  editingIntentionIdx: null,
  editingIntentionData: {},
  editingSubItemIdx: null,
  editingSubItemParentIdx: null,
  editingSubItemValue: '',
  editingIntentionItemIdx: null,
  editingIntentionItemParentIdx: null,
  editingIntentionItemType: null,
  editingIntentionItemValue: '',
  editingAffirmationIdx: null,
  editingAffirmationValue: '',
  selectedReminder: null,
  reminderTime: '09:00',
  reminderDate: '',
  reminderFrequency: 'once',
  editingReminderIdx: null,
  selectedRoutineBox: null,
  editingRoutineBox: null,
  gratitudeWords: [],

  setMainTab: (tab) => {
    State.currentMainTab = tab;
    if (tab === 'shift' && State.currentSubTab.shift === 'reflect') {
      State.gratitudeWords = getRandomGratitudeWords();
    }
  },

  setSubTab: (tab) => {
    State.currentSubTab[State.currentMainTab] = tab;
    if (State.currentMainTab === 'shift' && tab === 'reflect') {
      State.gratitudeWords = getRandomGratitudeWords();
    }
  },

  setCloseSubTab: (tab) => {
    State.closeSubTab = tab;
  },

  getSubTabs: () => {
    const tabs = {
      plan: ['priorities', 'intentions', 'affirmations'],
      flow: ['connect', 'followup', 'close'],
      shift: ['reflect', 'activate', 'meditate'],
      set: ['remind', 'routine', 'track']
    };
    return tabs[State.currentMainTab] || [];
  },

  setTheme: (theme) => {
    State.theme = theme;
    DataStore.saveTheme(theme);
    document.body.classList.toggle('light-theme', theme === 'light');
  },

  init: () => {
    State.theme = DataStore.theme();
    if (State.theme === 'light') {
      document.body.classList.add('light-theme');
    }
  }
};

State.init();


// onboarding messages
const OnboardingMessages = {
  'priorities': 'Add priorities that matter to you. Expand each to break down into sub-items. Activate or remind yourself of these priorities to stay focused.',
  'intentions': 'Create intentions with three components: a word, what you want to have, and the positive feeling attached. Track progress as you move toward your intended outcomes.',
  'affirmations': 'Create affirmations with text or audio. Choose practice types (breathing, mantras, visualization) to enhance your practice. Drag to reorder, and activate or set reminders for daily affirmations.',
  'connect': 'Select a content type (Quote, Message, Invoice, or Proposal), provide context details, and let AI generate professional content for you. Save your favorites for quick access later.',
  'followup': 'Add clients and set check-in tiers (Weekly to Quarterly). Track next check-in dates automatically. Log check-ins with custom notes for birthdays, holidays, and regular touch-points.',
  'close': 'Manage professional account closures and personal forgiveness items. Track closure progress and document your journey toward closing chapters and letting go.',
  'reflect': 'Check in with your emotional state. Select how you\'re feeling, share what you\'re grateful for, and track your emotional patterns over time.',
  'activate': 'Choose from four guided exercises: Breath Regulation for nervous system control, Focused Attention for priority focus, Generative Visualization for intention building, or Emotion Cultivation for affirmation practice.',
  'meditate': 'Select your meditation type (Open or Body Awareness), set your duration, and choose background and ending sounds. Find moments of calm and clarity in your day.',
  'remind': 'Select any item from your PLAN, FLOW, or SHIFT sections and set reminders with custom time, date, and repetition. Never miss an important action or check-in.',
  'routine': 'Build your daily routine by selecting time slots (in 15-minute increments) for each day of the week. Assign items from across all sections to create a structured schedule.'
};

const GratitudeWords = [
  'family', 'friends', 'health', 'love', 'home', 'food', 'water', 'safety', 'peace',
  'joy', 'sleep', 'nature', 'music', 'pets', 'kids', 'parents', 'partner', 'freedom',
  'school', 'money', 'support', 'hope', 'faith', 'healing', 'strength', 'comfort',
  'memories', 'travel', 'art', 'books', 'wisdom', 'patience', 'time', 'rest', 'success',
  'growth', 'purpose', 'trust', 'loyalty', 'honesty', 'warmth', 'calm', 'balance',
  'smiles', 'humor', 'holidays', 'courage', 'rain', 'oceans', 'animals', 'doctors',
  'teachers', 'mentors', 'prayer', 'fresh air', 'coffee', 'life', 'sunrise', 'sunset',
  'flowers', 'gardens', 'trees', 'birds', 'hugs', 'kindness', 'respect', 'family dog',
  'cookies', 'blankets', 'candles', 'movies', 'songs', 'weekends', 'vacation', 'hobbies',
  'dreams', 'laughter', 'phones', 'internet', 'cars', 'bikes', 'shoes', 'clothes',
  'showers', 'medicine', 'farms', 'neighbors', 'teamwork', 'exercise', 'running',
  'walking', 'dancing', 'reading', 'writing', 'drawing', 'cooking', 'baking', 'babies',
  'birthdays', 'picnics', 'camping', 'snow', 'summer', 'winter'
];

const getRandomGratitudeWords = (count = 9) => {
  const shuffled = [...GratitudeWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const getAllCardTitles = () => {
  const items = [];

  DataStore.priorities().forEach(p => items.push({ title: p.title, section: 'Priorities' }));
  DataStore.intentions().forEach(i => items.push({ title: i.title, section: 'Intentions' }));
  DataStore.affirmations().forEach(a => items.push({ title: a, section: 'Affirmations' }));

  const connectTemplates = DataStore.connectTemplates();
  if (connectTemplates.length > 0) items.push({ title: 'Connect', section: 'Connect' });

  const followupClients = DataStore.followupClients();
  followupClients.forEach(c => items.push({ title: c.name, section: 'FollowUp' }));

  const closeAccounts = DataStore.closeAccounts();
  closeAccounts.forEach(a => items.push({ title: a.name, section: 'Close' }));

  return items.filter((item, idx, arr) => arr.findIndex(i => i.title === item.title) === idx);
};

const renderOnboardingMessage = (tabKey) => {
  if (!OnboardingMessages[tabKey] || State.closedOnboarding[tabKey]) {
    return '';
  }

  return `
    <div class="card" style="margin-bottom: 16px; background: rgba(139, 31, 140, 0.2); border: 1px solid rgba(255, 192, 7, 0.3);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="card-title" style="color: var(--color-gold);">How it works</div>
          <div class="card-text" style="margin-top: 8px;">${OnboardingMessages[tabKey]}</div>
        </div>
        <button style="background: none; border: none; color: var(--color-gold); font-size: 24px; cursor: pointer; padding: 0; margin-left: 12px;" onclick="Actions.closeOnboarding('${tabKey}')">×</button>
      </div>
    </div>
  `;
};

// components & page rendering

const Components = {
  prioritiesPage: () => {
    const priorities = DataStore.priorities();
    let html = renderOnboardingMessage('priorities') + `
      <div class="section">
        <div class="input-group">
          <input type="text" class="input-field" id="newPriority" placeholder="Add new priority...">
          <button class="btn" onclick="Actions.addPriority()">+</button>
        </div>
    `;

    if (priorities.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No priorities yet</div>
        <div class="empty-subtext">Add your first priority above</div>
      </div>`;
    } else {
      priorities.forEach((p, idx) => {
        const isExpanded = State.expandedPriorities[idx];
        const isEditing = State.editingPriorityIdx === idx;
        const subItems = p.subItems || [];

        html += `
          <div class="card">
            ${isEditing ? `
              <div style="margin-bottom: 12px;">
                <input type="text" class="input-field" id="editPriorityTitle_${idx}" value="${p.title}" style="margin-bottom: 8px;">
                <div style="display: flex; gap: 8px;">
                  <button class="btn" style="flex: 1;" onclick="Actions.saveEditPriority(${idx})">Save</button>
                  <button class="btn" style="flex: 1;" onclick="Actions.cancelEditPriority()">Cancel</button>
                </div>
              </div>
            ` : `
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <button style="background: none; border: none; color: var(--text-dark); font-size: 18px; cursor: pointer; padding: 4px 8px;" onclick="Actions.togglePriorityExpand(${idx})">${isExpanded ? '▼' : '▶'}</button>
                <div class="card-title" style="flex: 1; margin: 0;">${p.title}</div>
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.deletePriority(${idx})">−</button>
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.editPriority(${idx})">•••</button>
              </div>
            `}
            ${isExpanded && !isEditing ? `
              <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; margin-bottom: 8px;">
                ${subItems.length === 0 ? '<div class="card-text" style="color: rgba(255,255,255,0.5); font-size: 12px;">No sub-items yet</div>' : ''}
                ${subItems.map((sub, subIdx) => {
                  const isEditingSub = State.editingSubItemParentIdx === idx && State.editingSubItemIdx === subIdx;
                  return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 6px;">
                    ${isEditingSub ? `
                      <input type="text" id="editSubItem_${idx}_${subIdx}" class="input-field" value="${sub}" style="flex: 1; padding: 6px 8px; height: auto;">
                      <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.saveEditSubItem(${idx}, ${subIdx})">✓</button>
                      <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.cancelEditSubItem()">✕</button>
                    ` : `
                      <div class="card-text" style="margin: 0; flex: 1;">${sub}</div>
                      <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px;" onclick="Actions.deleteSubItem(${idx}, ${subIdx})">−</button>
                      <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.editSubItem(${idx}, ${subIdx})">•••</button>
                    `}
                  </div>
                `;
                }).join('')}
                <div class="input-group" style="margin-bottom: 8px;">
                  <input type="text" class="input-field" id="subItem_${idx}" placeholder="Add sub-item...">
                  <button class="btn" onclick="Actions.addSubItem(${idx})">+</button>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      });
    }

    html += `
      <div style="margin-top: 20px;">
        <button class="btn" style="width: 100%;" onclick="Actions.navigateToActivate('focusedAttention')">Activate</button>
      </div>
    </div>`;
    return html;
  },

  intentionsPage: () => {
    const intentions = DataStore.intentions();
    let html = renderOnboardingMessage('intentions') + `
      <div class="section">
        <div class="input-group">
          <input type="text" class="input-field" id="newIntentionTitle" placeholder="Name your intention with a wor...">
        </div>
        <div class="input-group">
          <input type="text" class="input-field" id="newIntentionDesc" placeholder="Explain what you intend to hav...">
        </div>
        <div class="input-group">
          <input type="text" class="input-field" id="newIntentionFeeling" placeholder="Positive feeling attached to inte...">
          <button class="btn" onclick="Actions.addIntention()">+</button>
        </div>
    `;

    if (intentions.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No intentions yet</div>
        <div class="empty-subtext">Add your first intention above</div>
      </div>`;
    } else {
      intentions.forEach((i, idx) => {
        const isExpanded = State.expandedIntentions[idx];
        const isEditing = State.editingIntentionIdx === idx;
        const intends = i.intends || [];
        const feels = i.feels || [];

        html += `
          <div class="card">
            ${isEditing ? `
              <div style="margin-bottom: 12px;">
                <input type="text" class="input-field" id="editIntentionTitle_${idx}" value="${i.title}" style="margin-bottom: 8px;">
                <input type="text" class="input-field" id="editIntentionDesc_${idx}" value="${i.description || ''}" style="margin-bottom: 8px;">
                <input type="text" class="input-field" id="editIntentionFeeling_${idx}" value="${i.feeling || ''}" style="margin-bottom: 8px;">
                <div style="display: flex; gap: 8px;">
                  <button class="btn" style="flex: 1;" onclick="Actions.saveEditIntention(${idx})">Save</button>
                  <button class="btn" style="flex: 1;" onclick="Actions.cancelEditIntention()">Cancel</button>
                </div>
              </div>
            ` : `
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <button style="background: none; border: none; color: var(--text-dark); font-size: 18px; cursor: pointer; padding: 4px 8px;" onclick="Actions.toggleIntentionExpand(${idx})">${isExpanded ? '▼' : '▶'}</button>
                <div class="card-title" style="flex: 1; margin: 0;">– ${i.title}</div>
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.deleteIntention(${idx})">−</button>
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.editIntention(${idx})">•••</button>
              </div>
            `}

            ${isExpanded && !isEditing ? `
              <div style="margin-bottom: 12px;">
                <div style="color: var(--color-gold); font-weight: 700; font-size: 14px; margin-bottom: 8px;">I intend to</div>
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; margin-bottom: 8px;">
                  ${intends.length === 0 ? '<div class="card-text" style="color: rgba(255,255,255,0.5); font-size: 12px;">No intentions yet</div>' : ''}
                  ${intends.map((intent, intentIdx) => {
                    const isEditingIntent = State.editingIntentionItemParentIdx === idx && State.editingIntentionItemType === 'intends' && State.editingIntentionItemIdx === intentIdx;
                    return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; margin-bottom: 6px;">
                      ${isEditingIntent ? `
                        <input type="text" id="editIntentionItem_${idx}_intends_${intentIdx}" class="input-field" value="${intent}" style="flex: 1; padding: 6px 8px; height: auto;">
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.saveEditIntentionItem(${idx}, 'intends', ${intentIdx})">✓</button>
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.cancelEditIntentionItem()">✕</button>
                      ` : `
                        <div class="card-text" style="margin: 0; flex: 1;">${intent}</div>
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px;" onclick="Actions.deleteIntentionItem(${idx}, 'intends', ${intentIdx})">−</button>
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.editIntentionItem(${idx}, 'intends', ${intentIdx})">•••</button>
                      `}
                    </div>
                  `;
                  }).join('')}
                  <div class="input-group">
                    <input type="text" class="input-field" id="intentItem_${idx}" placeholder="Add intention...">
                    <button class="btn" onclick="Actions.addIntentionItem(${idx}, 'intends')">+</button>
                  </div>
                </div>

                <div style="color: var(--color-gold); font-weight: 700; font-size: 14px; margin-bottom: 8px;">I feel</div>
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px;">
                  ${feels.length === 0 ? '<div class="card-text" style="color: rgba(255,255,255,0.5); font-size: 12px;">No feelings yet</div>' : ''}
                  ${feels.map((feel, feelIdx) => {
                    const isEditingFeel = State.editingIntentionItemParentIdx === idx && State.editingIntentionItemType === 'feels' && State.editingIntentionItemIdx === feelIdx;
                    return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; margin-bottom: 6px;">
                      ${isEditingFeel ? `
                        <input type="text" id="editIntentionItem_${idx}_feels_${feelIdx}" class="input-field" value="${feel}" style="flex: 1; padding: 6px 8px; height: auto;">
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.saveEditIntentionItem(${idx}, 'feels', ${feelIdx})">✓</button>
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.cancelEditIntentionItem()">✕</button>
                      ` : `
                        <div class="card-text" style="margin: 0; flex: 1;">${feel}</div>
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px;" onclick="Actions.deleteIntentionItem(${idx}, 'feels', ${feelIdx})">−</button>
                        <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px; margin-left: 4px;" onclick="Actions.editIntentionItem(${idx}, 'feels', ${feelIdx})">•••</button>
                      `}
                    </div>
                  `;
                  }).join('')}
                  <div class="input-group">
                    <input type="text" class="input-field" id="feelItem_${idx}" placeholder="Add feeling...">
                    <button class="btn" onclick="Actions.addIntentionItem(${idx}, 'feels')">+</button>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      });
    }

    html += `
      <div style="margin-top: 20px;">
        <button class="btn" style="width: 100%;" onclick="Actions.navigateToActivate('generativeVisualization')">Activate</button>
      </div>
    </div>`;
    return html;
  },

  affirmationsPage: () => {
    const affirmations = DataStore.affirmations();
    let html = renderOnboardingMessage('affirmations') + `
      <div class="section">
        <div class="input-group">
          <input type="text" class="input-field" id="newAffirmation" placeholder="Add new affirmation...">
          <button class="btn" onclick="Actions.addAffirmation()">+</button>
        </div>
    `;

    if (affirmations.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No affirmations yet</div>
        <div class="empty-subtext">Add your first affirmation above</div>
      </div>`;
    } else {
      affirmations.forEach((a, idx) => {
        const isEditing = State.editingAffirmationIdx === idx;
        html += `
          <div class="card">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ${isEditing ? `
                <input type="text" id="editAffirmation_${idx}" class="input-field" value="${a}" style="flex: 1; margin: 0; padding: 11px 12px;">
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.saveEditAffirmation(${idx})">✓</button>
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.cancelEditAffirmation()">✕</button>
              ` : `
                <div class="card-text" style="flex: 1; margin: 0;">${a}</div>
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.deleteAffirmation(${idx})">−</button>
                <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.editAffirmation(${idx})">•••</button>
              `}
            </div>
          </div>
        `;
      });
    }

    html += `
      <button class="btn" style="width: 100%; margin-top: 20px;" onclick="Actions.navigateToActivate('emotionCultivation')">Activate</button>
    </div>`;
    return html;
  },

  remindPage: () => {
    const reminders = DataStore.reminders();
    const allTitles = getAllCardTitles();

    let html = renderOnboardingMessage('remind') + `
      <div class="section">
        <div class="card">
          <div class="card-title">Set Reminder</div>
          <div style="margin: 12px 0;">
            <select class="input-field" id="reminderItem" style="width: 100%; padding: 11px 12px; margin-bottom: 12px;">
              <option value="">Select an item...</option>
              ${allTitles.map(title => `<option value="${title}">${title}</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <input type="time" id="reminderTime" class="input-field" value="09:00" style="flex: 1; padding: 11px 12px;">
            <input type="date" id="reminderDate" class="input-field" style="flex: 1; padding: 11px 12px;">
          </div>
          <div style="margin-bottom: 12px;">
            <select class="input-field" id="reminderFrequency" style="width: 100%; padding: 11px 12px;">
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button class="btn" style="width: 100%;" onclick="Actions.setReminder()">Set</button>
        </div>
    `;

    if (reminders.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No reminders</div>
        <div class="empty-subtext">Set your first reminder above</div>
      </div>`;
    } else {
      html += `<div style="margin-top: 12px;"><div class="card-title">Active Reminders</div></div>`;
      reminders.forEach((reminder, idx) => {
        html += `
          <div class="card">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="flex: 1;">
                <div class="card-title" style="margin: 0;">${reminder.item}</div>
                <div class="card-text" style="font-size: 11px; margin: 4px 0;">${reminder.time} on ${reminder.date || 'TBD'}</div>
                <div class="card-text" style="font-size: 11px;">Repeats: ${reminder.frequency}</div>
              </div>
              <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.deleteReminder(${idx})">✕</button>
              <button class="btn" style="width: 32px; height: 32px; padding: 0; font-size: 16px;" onclick="Actions.editReminder(${idx})">•••</button>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },

  connectPage: () => {
    const templates = DataStore.connectTemplates();
    let html = renderOnboardingMessage('connect') + `
      <div class="section">
        <div class="input-group">
          <select class="input-field" id="generationType" style="padding: 11px 12px;">
            <option value="quote">Quote</option>
            <option value="message">Draft Message</option>
            <option value="invoice">Invoice</option>
            <option value="proposal">Proposal</option>
          </select>
        </div>
        <div class="input-group">
          <textarea class="input-field" id="generationContext" placeholder="Enter context or details and AI will generate a message..." style="min-height: 80px; resize: vertical; padding: 11px 12px;"></textarea>
        </div>
        <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.generateContent()">Generate</button>
    `;

    if (templates.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No templates yet</div>
        <div class="empty-subtext">Generate your first template above</div>
      </div>`;
    } else {
      templates.forEach((t, idx) => {
        html += `
          <div class="card">
            <div class="card-title">${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</div>
            <div class="card-text">${t.content.substring(0, 100)}...</div>
            <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.deleteTemplate(${idx})">Delete</button>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },

  followupPage: () => {
    const clients = DataStore.followupClients();
    let html = renderOnboardingMessage('followup') + `
      <div class="section">
        <div class="input-group">
          <input type="text" class="input-field" id="clientName" placeholder="Person name">
        </div>
        <div class="input-group">
          <select class="input-field" id="clientTier" style="padding: 11px 12px;">
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
        <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.addClient()">Add Client</button>
    `;

    if (clients.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No clients yet</div>
        <div class="empty-subtext">Add your first client above</div>
      </div>`;
    } else {
      clients.forEach((c, idx) => {
        const tierBadge = c.tier.charAt(0).toUpperCase() + c.tier.slice(1);
        html += `
          <div class="card">
            <div class="card-title">${c.name}</div>
            <div class="card-text">Tier: ${tierBadge}</div>
            <div class="card-text">Last Check-in: ${c.lastCheckIn || 'Never'}</div>
            <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.deleteClient(${idx})">Delete</button>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },

  closePage: () => {
    const closeTab = State.closeSubTab || 'professional';
    let html = renderOnboardingMessage('close');

    if (closeTab === 'professional') {
      html += Components.closeProfessionalPage();
    } else {
      html += Components.closePersonalPage();
    }
    return html;
  },

  closeProfessionalPage: () => {
    const accounts = DataStore.closeAccounts();
    let html = `
      <div class="section">
        <div class="input-group">
          <input type="text" class="input-field" id="accountName" placeholder="Account name...">
        </div>
        <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.addAccount()">Add Account</button>
    `;

    if (accounts.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No accounts to close</div>
        <div class="empty-subtext">Add your first account above</div>
      </div>`;
    } else {
      accounts.forEach((a, idx) => {
        html += `
          <div class="card">
            <div class="card-title">${a.name}</div>
            <div class="card-text">Status: ${a.status}</div>
            <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.deleteAccount(${idx})">Delete</button>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },

  closePersonalPage: () => {
    const forgiveness = DataStore.closeForgiveness();
    let html = `
      <div class="section">
        <div class="input-group">
          <input type="text" class="input-field" id="forgivenessItem" placeholder="Person or situation to forgive...">
        </div>
        <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.addForgiveness()">Add Item</button>
    `;

    if (forgiveness.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No forgiveness items yet</div>
        <div class="empty-subtext">Add your first item above</div>
      </div>`;
    } else {
      forgiveness.forEach((f, idx) => {
        html += `
          <div class="card">
            <div class="card-text">${f.description}</div>
            <div class="card-text">Status: ${f.status}</div>
            <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.deleteForgiveness(${idx})">Delete</button>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },

  activatePage: () => {
    const exercises = [
      { type: 'breathRegulation', title: 'Breath Regulation', desc: 'Regulate your nervous system with various breathing exercises.', color: '#4ECDC4' },
      { type: 'focusedAttention', title: 'Focused Attention', desc: 'Build mental clarity and focus', color: '#FF6B6B' },
      { type: 'generativeVisualization', title: 'Generative Visualization', desc: 'Manifest your intentions', color: '#95E1D3' },
      { type: 'emotionCultivation', title: 'Emotion Cultivation', desc: 'Build positive emotional states', color: '#FFE66D' }
    ];

    let html = renderOnboardingMessage('activate') + `<div class="section">`;

    if (State.activeExercise && State.activateTimer) {
      const exercise = exercises.find(e => e.type === State.activeExercise);
      const setup = State.exerciseSetup[State.activeExercise];

      if (State.activeExercise === 'focusedAttention' || State.activeExercise === 'emotionCultivation') {
        const items = State.activeExercise === 'focusedAttention' ? setup.selectedPriorities : setup.selectedAffirmations;
        const currentItem = items[setup.currentItemIdx] || 'Ready';
        html += `<div class="card" style="text-align: center; background: rgba(255, 192, 7, 0.15); border-color: var(--color-gold);">
          <div class="card-title" style="color: var(--color-gold);">${exercise.title}</div>
          <div style="font-size: 18px; color: var(--color-gold); margin: 16px 0; min-height: 40px;">${currentItem}</div>
          <div style="font-size: 48px; font-weight: 700; color: var(--color-gold); margin: 16px 0;">${State.activateTimer}</div>
          <button class="btn" style="width: 100%;" onclick="Actions.stopActivateTimer()">Stop</button>
        </div>`;
      } else if (State.activeExercise === 'generativeVisualization') {
        const selectedIntention = intentions[setup.selectedIntention];
        const intentionTitle = selectedIntention ? selectedIntention.title : '';
        html += `<div class="card" style="text-align: center; background: rgba(255, 192, 7, 0.15); border-color: var(--color-gold);">
          <div style="font-size: 48px; font-weight: 700; color: var(--color-gold); margin: 32px 0;">${intentionTitle}</div>
          <div style="font-size: 64px; font-weight: 700; color: var(--color-gold); margin: 16px 0;">${State.activateTimer}</div>
          <button class="btn" style="width: 100%;" onclick="Actions.stopActivateTimer()">Stop</button>
        </div>`;
      } else if (State.activeExercise === 'breathRegulation') {
        const phase = setup.currentPhase;
        const phases = { inhale: 'INHALE', hold: 'HOLD', exhale: 'EXHALE' };
        html += `<div class="card" style="text-align: center; background: rgba(255, 192, 7, 0.15); border-color: var(--color-gold);">
          <div class="card-title" style="color: var(--color-gold);">Breath Regulation</div>
          <div style="margin: 32px 0; display: flex; justify-content: center; align-items: center;">
            <div style="width: 200px; height: 200px; border-radius: 50%; background: rgba(255, 192, 7, 0.3); display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="font-size: 20px; color: var(--color-gold); font-weight: 700;">${phases[phase]}</div>
              <div style="font-size: 18px; color: var(--color-gold); margin-top: 8px;">${State.activateTimer}</div>
            </div>
          </div>
          <button class="btn" style="width: 100%;" onclick="Actions.stopActivateTimer()">Stop</button>
        </div>`;
      }
    } else if (State.activeExercise) {
      const exercise = exercises.find(e => e.type === State.activeExercise);
      const setup = State.exerciseSetup[State.activeExercise];
      const priorities = DataStore.priorities();
      const intentions = DataStore.intentions();
      const affirmations = DataStore.affirmations();

      if (State.activeExercise === 'focusedAttention') {
        html += `<div class="card" style="text-align: center;">
          <div class="card-title">${exercise.title}</div>
          <div class="card-text">Select up to 5 priorities to focus on during this session:</div>
          <div style="margin: 12px 0; text-align: left;">
            ${priorities.map((p, idx) => `
              <div style="display: flex; align-items: center; padding: 8px 0;">
                <input type="checkbox" id="priority_${idx}" onchange="Actions.togglePrioritySelection(${idx})" ${setup.selectedPriorities.includes(p.title) ? 'checked' : ''} style="margin-right: 8px;">
                <label for="priority_${idx}" style="color: var(--text-dark); cursor: pointer; flex: 1; text-align: left;">${p.title}</label>
              </div>
            `).join('')}
          </div>
          <div style="margin: 12px 0; display: flex; align-items: center; gap: 8px;">
            <label style="color: var(--text-dark); white-space: nowrap;">Duration (minutes):</label>
            <input type="number" id="focusDuration" min="1" value="${setup.duration}" onchange="Actions.setExerciseDuration('focusedAttention', this.value)" class="input-field" style="flex: 1; padding: 11px 12px;">
          </div>
          <button class="btn" style="width: 100%; margin-top: 12px;" onclick="Actions.startExerciseSession('focusedAttention')">Activate</button>
          <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.cancelExerciseSetup()">Cancel</button>
        </div>`;
      } else if (State.activeExercise === 'generativeVisualization') {
        html += `<div class="card" style="text-align: center;">
          <div class="card-title">${exercise.title}</div>
          <div class="card-text">Select an intention to visualize:</div>
          <div style="margin: 12px 0; text-align: left;">
            <select class="input-field" style="width: 100%; padding: 11px 12px;" onchange="Actions.selectIntention(this.value); UI.render();">
              <option value="">Choose an intention...</option>
              ${intentions.map((i, idx) => `<option value="${idx}" ${setup.selectedIntention === idx ? 'selected' : ''}>${i.title}</option>`).join('')}
            </select>
          </div>
          <div style="margin: 12px 0; display: flex; align-items: center; gap: 8px;">
            <label style="color: var(--text-dark); white-space: nowrap;">Duration (minutes):</label>
            <input type="number" id="vizDuration" min="1" value="${setup.duration}" onchange="Actions.setExerciseDuration('generativeVisualization', this.value)" class="input-field" style="flex: 1; padding: 11px 12px;">
          </div>
          <button class="btn" style="width: 100%; margin-top: 12px;" onclick="Actions.startExerciseSession('generativeVisualization')">Activate</button>
          <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.cancelExerciseSetup()">Cancel</button>
        </div>`;
      } else if (State.activeExercise === 'emotionCultivation') {
        html += `<div class="card" style="text-align: center;">
          <div class="card-title">${exercise.title}</div>
          <div class="card-text">Select up to 5 affirmations to cultivate:</div>
          <div style="margin: 12px 0; text-align: left;">
            ${affirmations.map((a, idx) => `
              <div style="display: flex; align-items: center; padding: 8px 0;">
                <input type="checkbox" id="aff_${idx}" onchange="Actions.toggleAffirmationSelection(${idx})" ${setup.selectedAffirmations.includes(a) ? 'checked' : ''} style="margin-right: 8px;">
                <label for="aff_${idx}" style="color: var(--text-dark); cursor: pointer; flex: 1; text-align: left;">${a}</label>
              </div>
            `).join('')}
          </div>
          <div style="margin: 12px 0; display: flex; align-items: center; gap: 8px;">
            <label style="color: var(--text-dark); white-space: nowrap;">Duration (minutes):</label>
            <input type="number" id="emotionDuration" min="1" value="${setup.duration}" onchange="Actions.setExerciseDuration('emotionCultivation', this.value)" class="input-field" style="flex: 1; padding: 11px 12px;">
          </div>
          <button class="btn" style="width: 100%; margin-top: 12px;" onclick="Actions.startExerciseSession('emotionCultivation')">Activate</button>
          <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.cancelExerciseSetup()">Cancel</button>
        </div>`;
      } else if (State.activeExercise === 'breathRegulation') {
        html += `<div class="card" style="text-align: center;">
          <div class="card-title">${exercise.title}</div>
          <div style="margin: 12px 0; text-align: left;">
            <label style="color: var(--text-dark); display: block; margin-bottom: 4px;">Type of Breathing:</label>
            <select id="breathType" class="input-field" style="width: 100%; padding: 11px 12px;" onchange="Actions.setBreathType(this.value)">
              <option value="calming" ${setup.type === 'calming' ? 'selected' : ''}>Calming (slow)</option>
              <option value="active" ${setup.type === 'active' ? 'selected' : ''}>Active (fast)</option>
              <option value="deep" ${setup.type === 'deep' ? 'selected' : ''}>Deep (long)</option>
            </select>
          </div>
          <div style="margin: 12px 0;">
            <label style="color: var(--text-dark); display: block; margin-bottom: 4px;">Pace:</label>
            <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
              <label style="color: var(--text-dark); font-size: 12px; white-space: nowrap;">Total Intervals:</label>
              <input type="number" id="breathIntervals" min="1" value="${setup.intervals}" onchange="Actions.setBreathParam('intervals', this.value)" class="input-field" style="flex: 1; padding: 11px 12px;">
            </div>
            <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
              <label style="color: var(--text-dark); font-size: 12px; white-space: nowrap;">Inhale (seconds):</label>
              <input type="number" id="breathInhale" min="1" value="${setup.inhaleTime}" onchange="Actions.setBreathParam('inhaleTime', this.value)" class="input-field" style="flex: 1; padding: 11px 12px;">
            </div>
            <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
              <label style="color: var(--text-dark); font-size: 12px; white-space: nowrap;">Hold (seconds):</label>
              <input type="number" id="breathHold" min="1" value="${setup.holdTime}" onchange="Actions.setBreathParam('holdTime', this.value)" class="input-field" style="flex: 1; padding: 11px 12px;">
            </div>
            <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
              <label style="color: var(--text-dark); font-size: 12px; white-space: nowrap;">Exhale (seconds):</label>
              <input type="number" id="breathExhale" min="1" value="${setup.exhaleTime}" onchange="Actions.setBreathParam('exhaleTime', this.value)" class="input-field" style="flex: 1; padding: 11px 12px;">
            </div>
          </div>
          <button class="btn" style="width: 100%; margin-top: 12px;" onclick="Actions.startExerciseSession('breathRegulation')">Activate</button>
          <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.cancelExerciseSetup()">Cancel</button>
        </div>`;
      }
    } else {
      exercises.forEach((ex) => {
        const helpText = ex.type !== 'breathRegulation' ? `<div class="card-text" style="font-size: 11px; margin-top: 8px; opacity: 0.7;">Must go to PLAN section to add items for this exercise.</div>` : '';
        html += `
          <div class="card" style="cursor: pointer;">
            <div class="card-title">${ex.title}</div>
            <div class="card-text">${ex.desc}</div>
            ${helpText}
            <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.setupExercise('${ex.type}')">Start</button>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },

  reflectPage: () => {
    const reflections = DataStore.reflections();
    const moods = ['Ashamed', 'Guilty', 'Grieving', 'Afraid', 'Angry', 'Neutral', 'Accepting', 'In Love', 'Joyful', 'Peaceful'];
    const emojis = ['😔', '😟', '😢', '😨', '😠', '😐', '🙂', '😍', '😄', '😌'];
    const currentIdx = State.currentMood !== null ? State.currentMood : 5;

    if (State.gratitudeWords.length === 0) {
      State.gratitudeWords = getRandomGratitudeWords();
    }

    let html = renderOnboardingMessage('reflect') + `
      <div class="section">
        <div class="card">
          <div class="card-title">Emotional Check In:</div>
          <div class="card-text" style="margin-bottom: 16px;">How are you feeling?</div>
          <div class="mood-slider-wrapper">
            <div class="mood-emojis">
              ${emojis.map((emoji, idx) => `
                <div class="mood-emoji" style="left: calc(20px + (100% - 40px) * ${idx / 9});">
                  <span style="opacity: ${currentIdx === idx ? '1' : '0.45'}; transform: scale(${currentIdx === idx ? '1.3' : '1'});">${emoji}</span>
                </div>
              `).join('')}
            </div>
            <input type="range" min="0" max="9" value="${currentIdx}" class="mood-slider" id="moodSlider" oninput="Actions.setMood(parseInt(this.value))" onchange="Actions.logMood(parseInt(this.value))" />
            <div class="mood-labels">
              ${moods.map((mood, idx) => `
                <div class="mood-label" style="left: calc(20px + (100% - 40px) * ${idx / 9});">
                  <span style="font-weight: ${currentIdx === idx ? '700' : '500'}; color: ${currentIdx === idx ? 'var(--color-gold)' : 'var(--text-dark)'};">${mood}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Emotional Shifting:</div>
          <div class="card-text" style="margin-bottom: 12px;">What are you grateful for?</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
            ${State.gratitudeWords.map(word => `
              <button class="gratitude-chip" onclick="Actions.addGratitudeWord('${word.replace(/'/g, "\\'")}')">${word}</button>
            `).join('')}
          </div>
          <div class="input-group">
            <textarea class="input-field" id="gratitudeInput" placeholder="Write something you're grateful for..." style="min-height: 60px; resize: vertical; padding: 11px 12px;"></textarea>
          </div>
          <button class="btn" style="width: 100%; margin-top: 8px;" onclick="Actions.addGratitude()">Add</button>
        </div>
    `;

    if (reflections.length === 0) {
      html += `<div class="empty-state">
        <div class="empty-text">No reflections yet</div>
        <div class="empty-subtext">Start reflecting today</div>
      </div>`;
    } else {
      html += `<div class="card">
        <div class="card-title">Recent Reflections</div>
      `;
      reflections.slice().reverse().forEach((r) => {
        const emoji = r.emoji || '';
        const time = r.time || '';
        html += `
          <div style="padding: 10px 0; border-bottom: 1px solid var(--border-1); margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 18px;">${emoji}</span>
              <span class="card-text" style="font-weight: 700; margin: 0;">${r.mood}</span>
              <span class="card-text" style="margin: 0 0 0 auto; font-size: 11px; opacity: 0.7;">${r.date} ${time}</span>
            </div>
            ${r.entry ? `<div class="card-text" style="margin-top: 4px;">${r.entry}</div>` : ''}
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  },

  meditePage: () => {
    if (State.activateTimer) {
      return renderOnboardingMessage('meditate') + `
        <div class="section">
          <div class="card" style="text-align: center; background: rgba(255, 192, 7, 0.15); border-color: var(--color-gold);">
            <div class="card-title" style="color: var(--color-gold);">Meditation Active</div>
            <div style="font-size: 48px; font-weight: 700; color: var(--color-gold); margin: 16px 0;">${State.activateTimer}</div>
            <button class="btn" style="width: 100%;" onclick="Actions.stopActivateTimer()">Stop Meditation</button>
          </div>
        </div>
      `;
    }

    return renderOnboardingMessage('meditate') + `
      <div class="section">
        <div class="card">
          <div class="card-title">Type</div>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button style="flex: 1; padding: 12px; background: ${State.meditationType === 'open' ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}; border: 1.5px solid ${State.meditationType === 'open' ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)'}; border-radius: 8px; color: ${State.meditationType === 'open' ? '#000' : 'var(--text-dark)'}; font-weight: 600; cursor: pointer; transition: all 0.2s;" onclick="Actions.setMeditationType('open')">Open Awareness</button>
            <button style="flex: 1; padding: 12px; background: ${State.meditationType === 'body' ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}; border: 1.5px solid ${State.meditationType === 'body' ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)'}; border-radius: 8px; color: ${State.meditationType === 'body' ? '#000' : 'var(--text-dark)'}; font-weight: 600; cursor: pointer; transition: all 0.2s;" onclick="Actions.setMeditationType('body')">Body Awareness</button>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Duration (minutes)</div>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button style="flex: 1; padding: 12px; background: ${State.meditationDuration === 5 ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}; border: 1.5px solid ${State.meditationDuration === 5 ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)'}; border-radius: 8px; color: ${State.meditationDuration === 5 ? '#000' : 'var(--text-dark)'}; font-weight: 600; cursor: pointer; transition: all 0.2s;" onclick="Actions.setMeditationDuration(5)">5</button>
            <button style="flex: 1; padding: 12px; background: ${State.meditationDuration === 10 ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}; border: 1.5px solid ${State.meditationDuration === 10 ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)'}; border-radius: 8px; color: ${State.meditationDuration === 10 ? '#000' : 'var(--text-dark)'}; font-weight: 600; cursor: pointer; transition: all 0.2s;" onclick="Actions.setMeditationDuration(10)">10</button>
            <button style="flex: 1; padding: 12px; background: ${State.meditationDuration === 15 ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}; border: 1.5px solid ${State.meditationDuration === 15 ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)'}; border-radius: 8px; color: ${State.meditationDuration === 15 ? '#000' : 'var(--text-dark)'}; font-weight: 600; cursor: pointer; transition: all 0.2s;" onclick="Actions.setMeditationDuration(15)">15</button>
            ${State.meditationDuration === 'custom' ? `
              <input type="number" class="input-field" id="customDurationInput" placeholder="Minutes" min="1" value="${State.customDuration}" style="flex: 1;" onchange="Actions.setCustomDuration(this.value)">
            ` : `
              <button style="flex: 1; padding: 12px; background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 8px; color: var(--text-dark); font-weight: 600; cursor: pointer; transition: all 0.2s;" onclick="Actions.setMeditationDuration('custom')">Custom</button>
            `}
          </div>
        </div>

        <div class="card">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div class="card-title" style="margin: 0;">Sounds</div>
            <div style="display: flex; gap: 8px; flex: 1;">
              <select class="input-field" id="backgroundSound" style="padding: 11px 12px; flex: 1;" onchange="Actions.setBackgroundSound(this.value)">
                <option value="silent" ${State.backgroundSound === 'silent' ? 'selected' : ''}>Silent</option>
                <option value="rain" ${State.backgroundSound === 'rain' ? 'selected' : ''}>Rain</option>
                <option value="forest" ${State.backgroundSound === 'forest' ? 'selected' : ''}>Forest</option>
                <option value="ocean" ${State.backgroundSound === 'ocean' ? 'selected' : ''}>Ocean</option>
              </select>
              <select class="input-field" id="endingSound" style="padding: 11px 12px; flex: 1;" onchange="Actions.setEndingSound(this.value)">
                <option value="">Ending:</option>
                <option value="gong" ${State.endingSound === 'gong' ? 'selected' : ''}>Gong</option>
                <option value="bell" ${State.endingSound === 'bell' ? 'selected' : ''}>Bell</option>
                <option value="chime" ${State.endingSound === 'chime' ? 'selected' : ''}>Chime</option>
                <option value="silence" ${State.endingSound === 'silence' ? 'selected' : ''}>Silence</option>
              </select>
            </div>
          </div>
        </div>

        <button class="btn" style="width: 100%; margin-top: 12px;" onclick="Actions.startMeditationTimer()">Start Meditation</button>
      </div>
    `;
  },

  routinePage: () => {
    const routineItems = DataStore.routineItems();
    const allTitles = getAllCardTitles();
    const daysShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const daysFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let html = renderOnboardingMessage('routine') + `
      <div class="section">
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr>
                <td style="padding: 8px; text-align: center; font-weight: 700; width: 50px;"></td>
                ${daysShort.map((day, idx) => `<td style="padding: 8px; text-align: center; font-weight: 700; border: 1px solid rgba(255,255,255,0.2);">${day}</td>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${Array.from({length: 96}).map((_, timeIdx) => {
                const hours = Math.floor(timeIdx / 4);
                const minutes = (timeIdx % 4) * 15;
                const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                return `
                  <tr>
                    <td style="padding: 4px; text-align: right; font-size: 10px; border: 1px solid rgba(255,255,255,0.2);">${timeStr}</td>
                    ${daysShort.map((_, dayIdx) => {
                      const boxKey = `${dayIdx}_${timeIdx}`;
                      const items = routineItems[boxKey] || [];
                      const isActive = items.length > 0;
                      return `
                        <td style="padding: 2px; border: 1px solid rgba(255,255,255,0.2); background: ${isActive ? 'rgba(255, 192, 7, 0.3)' : 'transparent'}; cursor: pointer;" onclick="Actions.selectRoutineBox('${boxKey}')">
                          ${isActive ? `<div style="padding: 2px; font-size: 9px; color: var(--color-gold); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${items[0]}</div>` : ''}
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    return html;
  },

  trackPage: () => {
    return `
      <div class="section">
        <div class="card">
          <div class="card-title">Progress Tracking</div>
          <div class="card-text">Track your emotional health and progress</div>
        </div>
      </div>
    `;
  },

  renderContent: () => {
    const mainTab = State.currentMainTab;
    const subTab = State.currentSubTab[mainTab];

    let html = '';

    if (mainTab === 'plan') {
      if (subTab === 'priorities') html = Components.prioritiesPage();
      else if (subTab === 'intentions') html = Components.intentionsPage();
      else if (subTab === 'affirmations') html = Components.affirmationsPage();
    } else if (mainTab === 'flow') {
      if (subTab === 'connect') {
        html = Components.connectPage();
      } else if (subTab === 'followup') {
        html = Components.followupPage();
      } else if (subTab === 'close') {
        const closeTabs = ['Professional', 'Personal'];
        let closeHtml = `<div style="display: flex; gap: 8px; margin-bottom: 12px;">`;
        closeTabs.forEach(tab => {
          const tabKey = tab.toLowerCase();
          const isActive = State.closeSubTab === tabKey ? 'active' : '';
          closeHtml += `<button class="subtab ${isActive}" onclick="State.setCloseSubTab('${tabKey}'); UI.render()">${tab}</button>`;
        });
        closeHtml += `</div>`;
        html = closeHtml + Components.closePage();
      }
    } else if (mainTab === 'shift') {
      if (subTab === 'reflect') html = Components.reflectPage();
      else if (subTab === 'activate') html = Components.activatePage();
      else if (subTab === 'meditate') html = Components.meditePage();
    } else if (mainTab === 'set') {
      if (subTab === 'remind') html = Components.remindPage();
      else if (subTab === 'routine') html = Components.routinePage();
      else if (subTab === 'track') html = Components.trackPage();
    }

    document.getElementById('contentArea').innerHTML = html;
  },

  renderSubtabs: () => {
    const subTabs = State.getSubTabs();
    const currentSub = State.currentSubTab[State.currentMainTab];

    let subtabsHtml = subTabs.map(tab => `
      <button class="subtab ${tab === currentSub ? 'active' : ''}" data-subtab="${tab}">
        ${tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    `).join('');

    document.getElementById('subtabsRow').innerHTML = subtabsHtml;

    document.querySelectorAll('.subtab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        State.setSubTab(e.target.dataset.subtab);
        UI.render();
      });
    });
  },

  renderThemeModal: () => {
    const themes = ['dark', 'light'];
    const themeName = {
      dark: 'Dark',
      light: 'Light'
    };

    let html = themes.map(t => `
      <div class="theme-option ${State.theme === t ? 'active' : ''}" onclick="State.setTheme('${t}'); UI.render()">
        <span class="theme-name">${themeName[t]}</span>
        ${State.theme === t ? '<span class="checkmark">✓</span>' : ''}
      </div>
    `).join('');

    document.getElementById('themeGrid').innerHTML = html;
  }
};


// actions & user interactions

const Actions = {
  addPriority: () => {
    const input = document.getElementById('newPriority');
    if (input.value.trim()) {
      const priorities = DataStore.priorities();
      priorities.push({ title: input.value.trim(), subItems: [] });
      DataStore.savePriorities(priorities);
      input.value = '';
      UI.render();
    }
  },

  deletePriority: (idx) => {
    const priorities = DataStore.priorities();
    priorities.splice(idx, 1);
    DataStore.savePriorities(priorities);
    delete State.expandedPriorities[idx];
    UI.render();
  },

  togglePriorityExpand: (idx) => {
    State.expandedPriorities[idx] = !State.expandedPriorities[idx];
    UI.render();
  },

  addSubItem: (priorityIdx) => {
    const input = document.getElementById(`subItem_${priorityIdx}`);
    if (input && input.value.trim()) {
      const priorities = DataStore.priorities();
      if (!priorities[priorityIdx].subItems) {
        priorities[priorityIdx].subItems = [];
      }
      priorities[priorityIdx].subItems.push(input.value.trim());
      DataStore.savePriorities(priorities);
      input.value = '';
      UI.render();
    }
  },

  deleteSubItem: (priorityIdx, subItemIdx) => {
    const priorities = DataStore.priorities();
    if (priorities[priorityIdx] && priorities[priorityIdx].subItems) {
      priorities[priorityIdx].subItems.splice(subItemIdx, 1);
      DataStore.savePriorities(priorities);
      UI.render();
    }
  },

  editPriority: (idx) => {
    State.editingPriorityIdx = idx;
    State.editingPriorityTitle = DataStore.priorities()[idx].title;
    UI.render();
  },

  saveEditPriority: (idx) => {
    const input = document.getElementById(`editPriorityTitle_${idx}`);
    if (input && input.value.trim()) {
      const priorities = DataStore.priorities();
      priorities[idx].title = input.value.trim();
      DataStore.savePriorities(priorities);
      State.editingPriorityIdx = null;
      State.editingPriorityTitle = '';
      UI.render();
    }
  },

  cancelEditPriority: () => {
    State.editingPriorityIdx = null;
    State.editingPriorityTitle = '';
    UI.render();
  },

  editSubItem: (parentIdx, subIdx) => {
    const priorities = DataStore.priorities();
    State.editingSubItemParentIdx = parentIdx;
    State.editingSubItemIdx = subIdx;
    State.editingSubItemValue = priorities[parentIdx].subItems[subIdx];
    UI.render();
  },

  saveEditSubItem: (parentIdx, subIdx) => {
    const input = document.getElementById(`editSubItem_${parentIdx}_${subIdx}`);
    if (input && input.value.trim()) {
      const priorities = DataStore.priorities();
      priorities[parentIdx].subItems[subIdx] = input.value.trim();
      DataStore.savePriorities(priorities);
      State.editingSubItemParentIdx = null;
      State.editingSubItemIdx = null;
      State.editingSubItemValue = '';
      UI.render();
    }
  },

  cancelEditSubItem: () => {
    State.editingSubItemParentIdx = null;
    State.editingSubItemIdx = null;
    State.editingSubItemValue = '';
    UI.render();
  },

  editAffirmation: (idx) => {
    const affirmations = DataStore.affirmations();
    State.editingAffirmationIdx = idx;
    State.editingAffirmationValue = affirmations[idx];
    UI.render();
  },

  saveEditAffirmation: (idx) => {
    const input = document.getElementById(`editAffirmation_${idx}`);
    if (input && input.value.trim()) {
      const affirmations = DataStore.affirmations();
      affirmations[idx] = input.value.trim();
      DataStore.saveAffirmations(affirmations);
      State.editingAffirmationIdx = null;
      State.editingAffirmationValue = '';
      UI.render();
    }
  },

  cancelEditAffirmation: () => {
    State.editingAffirmationIdx = null;
    State.editingAffirmationValue = '';
    UI.render();
  },

  editIntentionItem: (parentIdx, type, itemIdx) => {
    const intentions = DataStore.intentions();
    State.editingIntentionItemParentIdx = parentIdx;
    State.editingIntentionItemType = type;
    State.editingIntentionItemIdx = itemIdx;
    State.editingIntentionItemValue = intentions[parentIdx][type][itemIdx];
    UI.render();
  },

  saveEditIntentionItem: (parentIdx, type, itemIdx) => {
    const input = document.getElementById(`editIntentionItem_${parentIdx}_${type}_${itemIdx}`);
    if (input && input.value.trim()) {
      const intentions = DataStore.intentions();
      intentions[parentIdx][type][itemIdx] = input.value.trim();
      DataStore.saveIntentions(intentions);
      State.editingIntentionItemParentIdx = null;
      State.editingIntentionItemType = null;
      State.editingIntentionItemIdx = null;
      State.editingIntentionItemValue = '';
      UI.render();
    }
  },

  cancelEditIntentionItem: () => {
    State.editingIntentionItemParentIdx = null;
    State.editingIntentionItemType = null;
    State.editingIntentionItemIdx = null;
    State.editingIntentionItemValue = '';
    UI.render();
  },

  addIntention: () => {
    const titleInput = document.getElementById('newIntentionTitle');
    const descInput = document.getElementById('newIntentionDesc');
    const feelingInput = document.getElementById('newIntentionFeeling');

    if (titleInput.value.trim() && descInput.value.trim() && feelingInput.value.trim()) {
      const intentions = DataStore.intentions();
      intentions.push({
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        feeling: feelingInput.value.trim(),
        intends: [],
        feels: []
      });
      DataStore.saveIntentions(intentions);
      titleInput.value = '';
      descInput.value = '';
      feelingInput.value = '';
      UI.render();
    }
  },

  deleteIntention: (idx) => {
    const intentions = DataStore.intentions();
    intentions.splice(idx, 1);
    DataStore.saveIntentions(intentions);
    delete State.expandedIntentions[idx];
    UI.render();
  },

  toggleIntentionExpand: (idx) => {
    State.expandedIntentions[idx] = !State.expandedIntentions[idx];
    UI.render();
  },

  editIntention: (idx) => {
    State.editingIntentionIdx = idx;
    const intention = DataStore.intentions()[idx];
    State.editingIntentionData = {
      title: intention.title,
      description: intention.description,
      feeling: intention.feeling
    };
    UI.render();
  },

  saveEditIntention: (idx) => {
    const titleInput = document.getElementById(`editIntentionTitle_${idx}`);
    const descInput = document.getElementById(`editIntentionDesc_${idx}`);
    const feelingInput = document.getElementById(`editIntentionFeeling_${idx}`);

    if (titleInput.value.trim() && descInput.value.trim() && feelingInput.value.trim()) {
      const intentions = DataStore.intentions();
      intentions[idx].title = titleInput.value.trim();
      intentions[idx].description = descInput.value.trim();
      intentions[idx].feeling = feelingInput.value.trim();
      DataStore.saveIntentions(intentions);
      State.editingIntentionIdx = null;
      State.editingIntentionData = {};
      UI.render();
    }
  },

  cancelEditIntention: () => {
    State.editingIntentionIdx = null;
    State.editingIntentionData = {};
    UI.render();
  },

  addIntentionItem: (intentionIdx, type) => {
    const inputId = type === 'intends' ? `intentItem_${intentionIdx}` : `feelItem_${intentionIdx}`;
    const input = document.getElementById(inputId);
    if (input && input.value.trim()) {
      const intentions = DataStore.intentions();
      if (!intentions[intentionIdx][type]) {
        intentions[intentionIdx][type] = [];
      }
      intentions[intentionIdx][type].push(input.value.trim());
      DataStore.saveIntentions(intentions);
      input.value = '';
      UI.render();
    }
  },

  deleteIntentionItem: (intentionIdx, type, itemIdx) => {
    const intentions = DataStore.intentions();
    if (intentions[intentionIdx] && intentions[intentionIdx][type]) {
      intentions[intentionIdx][type].splice(itemIdx, 1);
      DataStore.saveIntentions(intentions);
      UI.render();
    }
  },

  addAffirmation: () => {
    const input = document.getElementById('newAffirmation');
    if (input.value.trim()) {
      const affirmations = DataStore.affirmations();
      affirmations.push(input.value.trim());
      DataStore.saveAffirmations(affirmations);
      input.value = '';
      UI.render();
    }
  },

  deleteAffirmation: (idx) => {
    const affirmations = DataStore.affirmations();
    affirmations.splice(idx, 1);
    DataStore.saveAffirmations(affirmations);
    UI.render();
  },

  addReminder: () => {
    const input = document.getElementById('newReminder');
    if (input.value.trim()) {
      const reminders = DataStore.reminders();
      const key = input.value.trim();
      if (!reminders[key]) {
        reminders[key] = [];
      }
      reminders[key].push(new Date().toLocaleDateString());
      DataStore.saveReminders(reminders);
      input.value = '';
      UI.render();
    }
  },

  deleteReminder: (key) => {
    const reminders = DataStore.reminders();
    delete reminders[key];
    DataStore.saveReminders(reminders);
    UI.render();
  },

  generateContent: () => {
    const typeEl = document.getElementById('generationType');
    const contextEl = document.getElementById('generationContext');
    if (typeEl && contextEl && contextEl.value.trim()) {
      const templates = DataStore.connectTemplates();
      templates.push({
        type: typeEl.value,
        content: contextEl.value.trim(),
        generatedAt: new Date().toLocaleDateString()
      });
      DataStore.saveConnectTemplates(templates);
      contextEl.value = '';
      UI.render();
    }
  },

  deleteTemplate: (idx) => {
    const templates = DataStore.connectTemplates();
    templates.splice(idx, 1);
    DataStore.saveConnectTemplates(templates);
    UI.render();
  },

  addClient: () => {
    const nameEl = document.getElementById('clientName');
    const tierEl = document.getElementById('clientTier');
    if (nameEl && nameEl.value.trim()) {
      const clients = DataStore.followupClients();
      clients.push({
        name: nameEl.value.trim(),
        tier: tierEl ? tierEl.value : 'weekly',
        lastCheckIn: null
      });
      DataStore.saveFollowupClients(clients);
      nameEl.value = '';
      UI.render();
    }
  },

  deleteClient: (idx) => {
    const clients = DataStore.followupClients();
    clients.splice(idx, 1);
    DataStore.saveFollowupClients(clients);
    UI.render();
  },

  addAccount: () => {
    const nameEl = document.getElementById('accountName');
    if (nameEl && nameEl.value.trim()) {
      const accounts = DataStore.closeAccounts();
      accounts.push({
        name: nameEl.value.trim(),
        status: 'Open'
      });
      DataStore.saveCloseAccounts(accounts);
      nameEl.value = '';
      UI.render();
    }
  },

  deleteAccount: (idx) => {
    const accounts = DataStore.closeAccounts();
    accounts.splice(idx, 1);
    DataStore.saveCloseAccounts(accounts);
    UI.render();
  },

  addForgiveness: () => {
    const itemEl = document.getElementById('forgivenessItem');
    if (itemEl && itemEl.value.trim()) {
      const forgiveness = DataStore.closeForgiveness();
      forgiveness.push({
        description: itemEl.value.trim(),
        status: 'Pending'
      });
      DataStore.saveCloseForgiveness(forgiveness);
      itemEl.value = '';
      UI.render();
    }
  },

  deleteForgiveness: (idx) => {
    const forgiveness = DataStore.closeForgiveness();
    forgiveness.splice(idx, 1);
    DataStore.saveCloseForgiveness(forgiveness);
    UI.render();
  },

  setMood: (moodIdx) => {
    State.currentMood = moodIdx;
    UI.render();
  },

  logMood: (moodIdx) => {
    const moods = ['Ashamed', 'Guilty', 'Grieving', 'Afraid', 'Angry', 'Neutral', 'Accepting', 'In Love', 'Joyful', 'Peaceful'];
    const emojis = ['😔', '😟', '😢', '😨', '😠', '😐', '🙂', '😍', '😄', '😌'];
    const now = new Date();
    const reflections = DataStore.reflections();
    reflections.push({
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: moods[moodIdx],
      emoji: emojis[moodIdx],
      type: 'mood'
    });
    DataStore.saveReflections(reflections);
    UI.render();
  },

  addGratitudeWord: (word) => {
    const input = document.getElementById('gratitudeInput');
    if (input) {
      const currentValue = input.value.trim();
      input.value = currentValue ? `${currentValue}, ${word}` : word;
      input.focus();
    }
  },

  addGratitude: () => {
    const input = document.getElementById('gratitudeInput');
    const moods = ['Ashamed', 'Guilty', 'Grieving', 'Afraid', 'Angry', 'Neutral', 'Accepting', 'In Love', 'Joyful', 'Peaceful'];
    const emojis = ['😔', '😟', '😢', '😨', '😠', '😐', '🙂', '😍', '😄', '😌'];
    if (input && input.value.trim()) {
      const moodIdx = State.currentMood !== null ? State.currentMood : 5;
      const now = new Date();
      const reflections = DataStore.reflections();
      reflections.push({
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: moods[moodIdx],
        emoji: emojis[moodIdx],
        entry: input.value.trim(),
        type: 'gratitude'
      });
      DataStore.saveReflections(reflections);
      input.value = '';
      UI.render();
    }
  },

  saveReflection: () => {
    const input = document.getElementById('reflectionInput');
    const moods = ['😢', '😞', '😐', '🙂', '😊', '😄'];
    if (input && input.value.trim()) {
      const reflections = DataStore.reflections();
      reflections.push({
        date: new Date().toLocaleDateString(),
        mood: moods[State.currentMood || 3] || '🙂',
        entry: input.value.trim(),
        type: 'reflection'
      });
      DataStore.saveReflections(reflections);
      input.value = '';
      State.currentMood = null;
      UI.render();
    }
  },

  startActivateTimer: (exerciseName) => {
    if (State.activateTimerInterval) {
      clearInterval(State.activateTimerInterval);
    }
    State.activateTimer = '5:00';
    let seconds = 300;

    State.activateTimerInterval = setInterval(() => {
      seconds--;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      State.activateTimer = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      UI.render();

      if (seconds <= 0) {
        clearInterval(State.activateTimerInterval);
        State.activateTimer = null;
        State.activateTimerInterval = null;
        UI.render();
      }
    }, 1000);

    UI.render();
  },

  navigateToActivate: (exerciseType) => {
    State.activeExercise = exerciseType;
    State.currentMainTab = 'shift';
    State.currentSubTab['shift'] = 'activate';
    UI.render();
  },

  stopActivateTimer: () => {
    if (State.activateTimerInterval) {
      clearInterval(State.activateTimerInterval);
    }
    State.activateTimer = null;
    State.activateTimerInterval = null;
    State.activeExercise = null;
    UI.render();
  },

  setupExercise: (exerciseType) => {
    State.activeExercise = exerciseType;
    State.exerciseSetup[exerciseType] = {
      ...State.exerciseSetup[exerciseType],
      selectedPriorities: [],
      selectedAffirmations: [],
      currentItemIdx: 0
    };
    UI.render();
  },

  cancelExerciseSetup: () => {
    State.activeExercise = null;
    UI.render();
  },

  togglePrioritySelection: (idx) => {
    const priorities = DataStore.priorities();
    const title = priorities[idx].title;
    const selected = State.exerciseSetup.focusedAttention.selectedPriorities;
    if (selected.includes(title)) {
      selected.splice(selected.indexOf(title), 1);
    } else if (selected.length < 5) {
      selected.push(title);
    }
    UI.render();
  },

  toggleAffirmationSelection: (idx) => {
    const affirmations = DataStore.affirmations();
    const selected = State.exerciseSetup.emotionCultivation.selectedAffirmations;
    if (selected.includes(affirmations[idx])) {
      selected.splice(selected.indexOf(affirmations[idx]), 1);
    } else if (selected.length < 5) {
      selected.push(affirmations[idx]);
    }
    UI.render();
  },

  selectIntention: (value) => {
    State.exerciseSetup.generativeVisualization.selectedIntention = value ? parseInt(value) : null;
    UI.render();
  },

  setExerciseDuration: (exercise, value) => {
    State.exerciseSetup[exercise].duration = parseInt(value) || 5;
    UI.render();
  },

  setBreathType: (type) => {
    State.exerciseSetup.breathRegulation.type = type;
    UI.render();
  },

  setBreathParam: (param, value) => {
    State.exerciseSetup.breathRegulation[param] = parseInt(value) || 1;
    UI.render();
  },

  startExerciseSession: (exerciseType) => {
    const setup = State.exerciseSetup[exerciseType];

    if (exerciseType === 'focusedAttention' && setup.selectedPriorities.length === 0) {
      return;
    }
    if (exerciseType === 'generativeVisualization' && setup.selectedIntention === null) {
      return;
    }
    if (exerciseType === 'emotionCultivation' && setup.selectedAffirmations.length === 0) {
      return;
    }

    const duration = setup.duration * 60;
    State.activateTimer = `${setup.duration}:00`;

    let timeLeft = duration;
    if (State.activateTimerInterval) {
      clearInterval(State.activateTimerInterval);
    }

    if (exerciseType === 'breathRegulation') {
      const breathSetup = setup;
      const cycleTime = (breathSetup.inhaleTime + breathSetup.holdTime + breathSetup.exhaleTime) * 1000;
      const totalTime = cycleTime * breathSetup.intervals;
      let elapsed = 0;

      State.activateTimerInterval = setInterval(() => {
        elapsed += 1000;
        const phaseInCycle = elapsed % cycleTime;
        const inhaleMs = breathSetup.inhaleTime * 1000;
        const holdMs = breathSetup.holdTime * 1000;

        if (phaseInCycle < inhaleMs) {
          State.exerciseSetup.breathRegulation.currentPhase = 'inhale';
          State.activateTimer = String(Math.ceil((inhaleMs - phaseInCycle) / 1000));
        } else if (phaseInCycle < inhaleMs + holdMs) {
          State.exerciseSetup.breathRegulation.currentPhase = 'hold';
          State.activateTimer = String(Math.ceil((inhaleMs + holdMs - phaseInCycle) / 1000));
        } else {
          State.exerciseSetup.breathRegulation.currentPhase = 'exhale';
          State.activateTimer = String(Math.ceil((cycleTime - phaseInCycle) / 1000));
        }

        UI.render();

        if (elapsed >= totalTime) {
          clearInterval(State.activateTimerInterval);
          State.activateTimer = null;
          State.activeExercise = null;
          UI.render();
        }
      }, 1000);
    } else {
      const items = exerciseType === 'focusedAttention' ? setup.selectedPriorities : (exerciseType === 'emotionCultivation' ? setup.selectedAffirmations : null);

      State.activateTimerInterval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        State.activateTimer = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (items && timeLeft % 3 === 0) {
          setup.currentItemIdx = (setup.currentItemIdx + 1) % items.length;
        }

        UI.render();

        if (timeLeft <= 0) {
          clearInterval(State.activateTimerInterval);
          State.activateTimer = null;
          State.activeExercise = null;
          UI.render();
        }
      }, 1000);
    }

    UI.render();
  },

  showMeditationSetup: () => {
    State.showMeditationSetup = true;
    UI.render();
  },

  cancelMeditationSetup: () => {
    State.showMeditationSetup = false;
    UI.render();
  },

  setMeditationType: (type) => {
    State.meditationType = type;
    UI.render();
  },

  setMeditationDuration: (duration) => {
    State.meditationDuration = duration;
    if (duration !== 'custom') {
      State.customDuration = '';
    }
    UI.render();
  },

  setCustomDuration: (value) => {
    State.customDuration = value;
    UI.render();
  },

  setBackgroundSound: (sound) => {
    State.backgroundSound = sound;
    UI.render();
  },

  setEndingSound: (sound) => {
    State.endingSound = sound;
    UI.render();
  },

  setCloseTab: (tab) => {
    State.closeSubTab = tab;
    UI.render();
  },

  startMeditationTimer: () => {
    let duration = State.meditationDuration;
    if (duration === 'custom') {
      const customValue = parseInt(State.customDuration) || 5;
      duration = customValue;
    }
    const totalSeconds = duration * 60;

    State.showMeditationSetup = false;
    State.activateTimer = `${duration}:00`;

    let seconds = totalSeconds;
    if (State.activateTimerInterval) {
      clearInterval(State.activateTimerInterval);
    }

    State.activateTimerInterval = setInterval(() => {
      seconds--;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      State.activateTimer = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      UI.render();

      if (seconds <= 0) {
        clearInterval(State.activateTimerInterval);
        State.activateTimer = null;
        State.activateTimerInterval = null;
        UI.render();
      }
    }, 1000);

    UI.render();
  },

  closeOnboarding: (tabKey) => {
    State.closedOnboarding[tabKey] = true;
    DataStore.saveClosedOnboarding(State.closedOnboarding);
    UI.render();
  },

  setReminder: () => {
    const itemSelect = document.getElementById('reminderItem');
    const timeInput = document.getElementById('reminderTime');
    const dateInput = document.getElementById('reminderDate');
    const frequencySelect = document.getElementById('reminderFrequency');

    if (itemSelect.value && timeInput.value) {
      const reminders = DataStore.reminders();
      reminders.push({
        item: itemSelect.value,
        time: timeInput.value,
        date: dateInput.value,
        frequency: frequencySelect.value
      });
      DataStore.saveReminders(reminders);
      itemSelect.value = '';
      timeInput.value = '09:00';
      dateInput.value = '';
      frequencySelect.value = 'once';
      UI.render();
    }
  },

  deleteReminder: (idx) => {
    const reminders = DataStore.reminders();
    reminders.splice(idx, 1);
    DataStore.saveReminders(reminders);
    UI.render();
  },

  editReminder: (idx) => {
    const reminders = DataStore.reminders();
    const reminder = reminders[idx];
    State.editingReminderIdx = idx;
    document.getElementById('reminderItem').value = reminder.item;
    document.getElementById('reminderTime').value = reminder.time;
    document.getElementById('reminderDate').value = reminder.date;
    document.getElementById('reminderFrequency').value = reminder.frequency;
  },

  selectRoutineBox: (boxKey) => {
    State.selectedRoutineBox = boxKey;
    State.editingRoutineBox = boxKey;

    const allItems = getAllCardTitles();
    const routineItems = DataStore.routineItems();
    const itemsInBox = routineItems[boxKey] || [];

    let html = `
      <div style="margin-bottom: 16px;">
        <label style="color: var(--text-dark); display: block; margin-bottom: 8px; font-weight: 600;">Select Item:</label>
        <select class="input-field" id="routineItemSelect" style="width: 100%; padding: 11px 12px; margin-bottom: 12px;">
          <option value="">Choose an item...</option>
          ${allItems.map(item => `<option value="${item.title}">${item.title} (${item.section})</option>`).join('')}
        </select>
        <button class="btn" style="width: 100%; margin-bottom: 16px;" onclick="Actions.setRoutineItem('${boxKey}')">Set</button>
      </div>
    `;

    if (itemsInBox.length > 0) {
      html += `<div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px;">
        <div class="card-title" style="margin-bottom: 12px;">Items in this slot:</div>`;
      itemsInBox.forEach((item, idx) => {
        html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(255,192,7,0.1); border-radius: 4px; margin-bottom: 6px;">
          <div style="color: var(--text-dark); flex: 1; font-size: 13px;">${item}</div>
          <button class="btn" style="width: 28px; height: 28px; padding: 0; font-size: 12px;" onclick="Actions.deleteRoutineItem('${boxKey}', ${idx})">✕</button>
        </div>`;
      });
      html += `</div>`;
    }

    document.getElementById('routineItemList').innerHTML = html;
    document.getElementById('routineModal').classList.remove('hidden');
  },

  setRoutineItem: (boxKey) => {
    const select = document.getElementById('routineItemSelect');
    if (select.value) {
      Actions.addRoutineItem(boxKey, select.value);
      document.getElementById('routineModal').classList.add('hidden');
    }
  },

  closeRoutineModal: () => {
    document.getElementById('routineModal').classList.add('hidden');
    State.selectedRoutineBox = null;
    State.editingRoutineBox = null;
  },

  addRoutineItem: (boxKey, itemTitle) => {
    const routineItems = DataStore.routineItems();
    if (!routineItems[boxKey]) {
      routineItems[boxKey] = [];
    }
    routineItems[boxKey].push(itemTitle);
    DataStore.saveRoutineItems(routineItems);
    State.selectedRoutineBox = null;
    State.editingRoutineBox = null;
    UI.render();
  },

  deleteRoutineItem: (boxKey, itemIdx) => {
    const routineItems = DataStore.routineItems();
    if (routineItems[boxKey]) {
      routineItems[boxKey].splice(itemIdx, 1);
      if (routineItems[boxKey].length === 0) {
        delete routineItems[boxKey];
      }
      DataStore.saveRoutineItems(routineItems);
    }
    UI.render();
  }
};


// ui management & app initialization

const UI = {
  init: () => {
    UI.attachEventListeners();
    UI.render();
  },

  attachEventListeners: () => {
    document.querySelectorAll('.main-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        State.setMainTab(tabName);
        UI.render();
      });
    });

    document.getElementById('themeBtn').addEventListener('click', () => {
      document.getElementById('themeModal').classList.toggle('hidden');
      Components.renderThemeModal();
    });

    document.getElementById('modalOverlay').addEventListener('click', () => {
      document.getElementById('themeModal').classList.add('hidden');
    });
  },

  updateMainTabs: () => {
    document.querySelectorAll('.main-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.tab === State.currentMainTab) {
        tab.classList.add('active');
      }
    });
  },

  render: () => {
    UI.updateMainTabs();
    Components.renderSubtabs();
    Components.renderContent();
  }
};

window.addEventListener('DOMContentLoaded', UI.init);
