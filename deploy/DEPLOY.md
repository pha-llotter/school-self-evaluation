# Moving School Self-Evaluation to the Contabo VPS

Type each command exactly as shown. Only two things are yours to fill in, wherever they appear:

| Placeholder | Replace with | Example |
|---|---|---|
| `VPS-IP` | Your VPS's IPv4 address (Contabo control panel) | `185.123.45.67` |
| `sse.yourschool.co.za` | The web address you want for the form | `sse.phahs.org.za` |

How it fits together: this PC → **GitHub** (public repo `pha-llotter/school-self-evaluation`) → **VPS** downloads it, builds it and runs it behind **Caddy** (automatic HTTPS).
Your answers, the database and passwords **never go to GitHub**: the `data` folder is excluded.

---

## Part A – DNS (once)

At whoever manages your domain's DNS, add:

| Type | Name | Value |
|---|---|---|
| A | `sse` (the part before your domain) | `VPS-IP` |

Check it from this PC (PowerShell). Go on when it shows the VPS IP:
```powershell
nslookup sse.yourschool.co.za
```

## Part B – Push the app to GitHub (this PC, PowerShell, once)

```powershell
cd C:\Users\SYSOP\Desktop\SchoolSelfEvaluation
git init -b main
git add .
git commit -m "School Self-Evaluation v1"
gh repo create school-self-evaluation --public --source . --push
```

Check that **no data** went up. This must print nothing:
```powershell
git ls-files data
```

## Part C – Prepare the VPS (once)

Sign in from PowerShell. The first time, type `yes` at the fingerprint question, then enter the root password from Contabo's email:
```powershell
ssh root@VPS-IP
```

Now on the VPS, one line at a time:
```bash
apt-get update && apt-get install -y git
git clone https://github.com/pha-llotter/school-self-evaluation.git /opt/sse-src
bash /opt/sse-src/deploy/setup-server.sh sse.yourschool.co.za
sse-deploy
```
- `setup-server.sh` takes a few minutes. It installs Node 24, Caddy, the firewall (only SSH and web open), automatic security updates, the service and the nightly backup.
- `sse-deploy` builds and starts the app, and ends with **App is running.**

Get the first admin password:
```bash
cat /var/lib/sse/ADMIN-FIRST-LOGIN.txt
```
Open **https://sse.yourschool.co.za/admin**, sign in as `admin` with that password, and choose your own. Then delete the file:
```bash
rm /var/lib/sse/ADMIN-FIRST-LOGIN.txt
```
The form is at **https://sse.yourschool.co.za**.

## Part D – (Optional) Bring across responses already on this PC

Skip this if nothing real has been submitted here yet. It also brings the admin password you use here.

1. On this PC, stop the app. Close its window, or in PowerShell:
   ```powershell
   Get-NetTCPConnection -LocalPort 5050 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   scp C:\Users\SYSOP\Desktop\SchoolSelfEvaluation\data\sse.db root@VPS-IP:/root/sse.db
   ```
2. On the VPS:
   ```bash
   systemctl stop sse
   rm -f /var/lib/sse/sse.db /var/lib/sse/sse.db-wal /var/lib/sse/sse.db-shm /var/lib/sse/ADMIN-FIRST-LOGIN.txt
   install -o sse -g sse -m 600 /root/sse.db /var/lib/sse/sse.db
   rm /root/sse.db
   systemctl start sse
   ```

---

## Updating later (each time you change something)

On this PC (PowerShell):
```powershell
cd C:\Users\SYSOP\Desktop\SchoolSelfEvaluation
git add .
git commit -m "Describe the change"
git push
```
On the VPS:
```bash
sse-deploy
```
Responses and settings are kept, and the database is backed up before every update.

**Roll back** to the previous version if an update misbehaves:
```bash
systemctl stop sse && rm -rf /opt/sse.bad && mv /opt/sse /opt/sse.bad && mv /opt/sse.prev /opt/sse && systemctl start sse
```

## Everyday commands (on the VPS)

| Task | Command |
|---|---|
| Is it running? | `systemctl status sse` |
| Recent log | `journalctl -u sse -n 100` |
| Restart | `systemctl restart sse` |
| Backup now | `sse-backup` |
| List backups | `ls -lh /var/backups/sse` |
| Restore a backup | `systemctl stop sse; gunzip -c /var/backups/sse/FILE.db.gz > /var/lib/sse/sse.db; rm -f /var/lib/sse/sse.db-wal /var/lib/sse/sse.db-shm; chown sse:sse /var/lib/sse/sse.db; systemctl start sse` |
| Forgot admin password | `systemctl stop sse; sqlite3 /var/lib/sse/sse.db "DELETE FROM settings WHERE key = 'admin_hash'"; systemctl start sse; cat /var/lib/sse/ADMIN-FIRST-LOGIN.txt` |

Backups are kept 30 days on the VPS. To copy one to this PC (PowerShell):
```powershell
scp root@VPS-IP:/var/backups/sse/FILE.db.gz C:\Users\SYSOP\Desktop\
```

## Recommended once everything works: SSH key instead of password

On this PC (PowerShell). Press Enter at every question of `ssh-keygen`:
```powershell
ssh-keygen -t ed25519
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@VPS-IP "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@VPS-IP
```
If that last command signs you in **without asking for a password**, switch password sign-in off on the VPS:
```bash
echo "PasswordAuthentication no" > /etc/ssh/sshd_config.d/00-no-password.conf
sshd -t && systemctl restart ssh
```
Keep this PC's `.ssh` folder safe. It is now the key to the server (Contabo's web console still works as a fallback).
