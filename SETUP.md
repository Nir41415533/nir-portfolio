# 🚀 מדריך הפעלה - Nir's Portfolio

## 📋 דרישות מקדימות
- Python 3.8 או גבוה יותר
- OpenAI API key

## 🔧 שלב 1: הכנת הסביבה

### יצירת סביבה וירטואלית
```bash
# יצירת סביבה וירטואלית
python3 -m venv venv

# הפעלת הסביבה הוירטואלית
# ב-macOS/Linux:
source venv/bin/activate
# ב-Windows:
venv\Scripts\activate
```

### התקנת תלויות
```bash
# עדכון pip
pip install --upgrade pip

# התקנת תלויות
pip install -r requirements.txt
pip install -r backend/requirements.txt
```

## 🔑 שלב 2: הגדרת משתני סביבה

צור קובץ `.env` בתיקיית `backend`:

```bash
cd backend
touch .env
```

הוסף את התוכן הבא לקובץ `backend/.env`:

```env
# OpenAI API Key - קבל מ-https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here

# Admin Token (ייווצר אוטומטית אם לא מסופק)
ADMIN_TOKEN=your-admin-token-here

# Port (אופציונלי, ברירת מחדל: 5000)
PORT=5000
```

### קבלת OpenAI API Key:
1. היכנס ל-https://platform.openai.com/api-keys
2. צור חשבון או התחבר
3. צור API key חדש
4. העתק את ה-key (מתחיל ב-`sk-`)
5. הדבק ב-`OPENAI_API_KEY` בקובץ `.env`

## 🚀 שלב 3: הפעלת השרת

```bash
# נווט לתיקיית backend
cd backend

# הפעל את השרת
python -m uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```

## 🌐 שלב 4: גישה לאפליקציה

פתח את הדפדפן ונווט ל:
- **הפורטופוליו הראשי**: http://localhost:5000
- **תיעוד ה-API**: http://localhost:5000/docs

## 🛠️ פיתוח

### הפעלה עם auto-reload (לפיתוח):
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

### עצירת השרת:
לחץ `Ctrl+C` בטרמינל

## 🔧 פתרון בעיות

### בעיה: "Module not found"
```bash
# וודא שהסביבה הוירטואלית מופעלת
source venv/bin/activate

# התקן מחדש את התלויות
pip install -r requirements.txt
pip install -r backend/requirements.txt
```

### בעיה: OpenAI API errors
- וודא שה-API key נכון
- בדוק שיש לך קרדיטים בחשבון OpenAI
- וודא שה-API key מתחיל ב-`sk-`

### בעיה: Port כבר בשימוש
```bash
# שנה פורט בקובץ .env או השתמש בפורט אחר
python -m uvicorn app.main:app --port 5001
```

### בעיה: שגיאות CORS
- השרת מוגדר עבור localhost:5173
- עדכן הגדרות CORS ב-`main.py` אם צריך

## 📁 מבנה הפרוייקט

```
nir-portfolio/
├── venv/                    # סביבה וירטואלית
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py         # שרת FastAPI
│   ├── requirements.txt     # תלויות backend
│   └── .env                # משתני סביבה
├── frontend/
│   └── static/
│       ├── index.html      # דף הפורטופוליו הראשי
│       ├── css/
│       │   └── styles.css  # עיצוב
│       ├── js/
│       │   ├── script.js   # JavaScript ראשי
│       │   └── chatbot.js  # לוגיקת הטרמינל
│       └── images/
└── requirements.txt         # תלויות ראשיות
```

## 🎯 תכונות הפורטופוליו

### Frontend
- **עיצוב רספונסיבי**: מותאם לכל המכשירים
- **מצב כהה/בהיר**: החלפה עם שמירה ב-localStorage
- **טרמינל אינטראקטיבי**: צ'אטבוט מבוסס AI
- **תצוגת פרוייקטים**: כרטיסים יפים עם אפקטים
- **ויזואליזציית כישורים**: מאורגנים לפי קטגוריות
- **אנימציות חלקות**: Typed.js ו-particles.js

### Backend
- **FastAPI**: מסגרת Python מודרנית ומהירה
- **אינטגרציה OpenAI**: GPT-3.5-turbo לתשובות חכמות
- **הגבלת קצב**: מעקב שימוש מתוחכם
- **אבטחה**: חסימת IP, אימות קלט
- **שירות קבצים סטטיים**: אספקת קבצים יעילה

## 🤖 פקודות הטרמינל

הצ'אטבוט תומך בפקודות שונות:

### פקודות בסיסיות
- `help` - הצג פקודות זמינות
- `ls` - רשום קבצים בתיקייה נוכחית
- `pwd` - הדפס תיקייה נוכחית
- `cd [directory]` - שנה תיקייה
- `cat [file]` - הצג תוכן קובץ

### פקודות מידע
- `skills` - צפה בכישורים טכניים
- `projects` - צפה בפרוייקטי הפורטופוליו
- `experience` - צפה בניסיון עבודה
- `education` - צפה ברקע אקדמי
- `about` - למד על ניר
- `contact` - קבל פרטי קשר

### שפה טבעית
אפשר גם לשאול שאלות בשפה טבעית:
- "ספר לי על הניסיון שלך ב-Python"
- "איזה פרוייקטים עבדת עליהם?"
- "האם יש לך ניסיון עם Docker?"

## 🔒 תכונות אבטחה

- **הגבלת קצב**: 40 בקשות ליום, 10 לשעה
- **חסימת IP**: חסימה אוטומטית של פעילות חשודה
- **מעקב טוקנים**: מונע שימוש לרעה ב-API
- **אימות קלט**: מטהר קלט משתמש

## 📞 תמיכה

לבעיות או שאלות:
- אימייל: nir41415511@gmail.com
- LinkedIn: https://linkedin.com/in/python-fighter
- GitHub: https://github.com/Nir41415533 