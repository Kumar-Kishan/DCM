#Get key from argument list
$key = "41e0459065edb4192654c4e08ddd19b9780699a237968e712a076d388539d825"

$delay = 1

for ($zone = 4 ; $zone -ge 1; $zone--) {
    Write-Output "Starting zone $zone"
    for ($rack = 5; $rack -ge 1; $rack--) {
        Write-Output "Starting rack $rack"
        for ($server = 5; $server -ge 1; $server--) {
            Write-Output "Starting server $server"
            $cmd = "docker run -e ZONE=zone-$zone -e RACK=rack-$rack -e SERVER=server-$server -e KEY=$key -d --name agent-$zone-$rack-$server agent"
            Start-Process -FilePath "cmd.exe" -ArgumentList "/c $cmd" -WindowStyle Hidden
            Start-Sleep -Seconds $delay
        }
        $delay += 1
    }
}
