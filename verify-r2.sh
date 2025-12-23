#!/bin/bash

echo "🔍 Verifica configurazione R2..."
echo ""

# Verifica wrangler.jsonc
if grep -q "r2_buckets" wrangler.jsonc; then
  echo "✅ wrangler.jsonc configurato correttamente"
  
  # Estrai il nome del bucket
  BUCKET_NAME=$(grep -A 2 "r2_buckets" wrangler.jsonc | grep "bucket_name" | cut -d'"' -f4)
  echo "   Nome bucket: $BUCKET_NAME"
else
  echo "❌ wrangler.jsonc non ha configurazione R2"
  exit 1
fi

echo ""
echo "📋 Prossimi passi:"
echo "1. Vai su https://dash.cloudflare.com"
echo "2. Seleziona R2 dal menu"
echo "3. Crea un bucket chiamato: $BUCKET_NAME"
echo "4. Esegui: npm run build && wrangler deploy"
echo ""
echo "📖 Leggi SETUP_R2_QUICK.md per istruzioni dettagliate"
