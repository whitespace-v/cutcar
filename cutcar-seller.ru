upstream client-upstream {
    server    0.0.0.0:3000;
    keepalive 15;
}

upstream server-upstream {
    server    0.0.0.0:5000;
    keepalive 15;
}

server {
    server_name cutcar-seller.ru  www.cutcar-seller.ru;

    location / {
        proxy_pass http://client-upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://server-upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /images/proxy/ {
    	proxy_pass http://export-content.baz-on.ru/pub/;
    	proxy_set_header Host export-content.baz-on.ru;
    	proxy_hide_header X-Frame-Options;
    	proxy_hide_header X-Content-Type-Options;
   	proxy_hide_header Content-Security-Policy;
    }
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/cutcar-seller.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/cutcar-seller.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = cutcar-seller.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name cutcar-seller.ru  www.cutcar-seller.ru;
    return 404; # managed by Certbot
}
